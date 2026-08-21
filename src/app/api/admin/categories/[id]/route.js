// app/api/admin/categories/[id]/route.js

import { NextResponse } from "next/server";
import { ObjectId } from "mongoose";
import dbConnect from "@/lib/db/dbConnect";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth/guards";
import { updateCategorySchema } from "@/lib/validation/entitySchema";
import { CATEGORIES } from "@/lib/cache/tags";
import { revalidateTag } from "next/cache";

export async function PUT(request, { params }) {
  try {
    const authError = requireAdmin(request);
    if (authError) return authError;

    const { id } = params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid category ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const result = updateCategorySchema.safeParse(body);

    if (!result.success) {
      const fieldErrors = result.error.issues.reduce((acc, issue) => {
        const field = issue.path[0];
        if (!acc[field]) acc[field] = [];
        acc[field].push(issue.message);
        return acc;
      }, {});
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: fieldErrors },
        { status: 422 }
      );
    }

    await dbConnect();

    const existing = await Category.findById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    const { name, slug, description, image, parentId, isActive, sortOrder } =
      result.data;

    // Slug uniqueness check (skip if slug unchanged)
    if (slug && slug !== existing.slug) {
      const slugTaken = await Category.findOne({
        slug,
        _id: { $ne: id },
      });
      if (slugTaken) {
        return NextResponse.json(
          {
            success: false,
            message: "Category with this slug already exists",
            errors: { slug: ["This slug is already taken"] },
          },
          { status: 409 }
        );
      }
    }

    // Prevent setting self as parent (circular reference)
    if (parentId && parentId.toString() === id) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: { parentId: ["Category cannot be its own parent"] },
        },
        { status: 422 }
      );
    }

    // Prevent setting descendant as parent (deeper circular check)
    if (parentId) {
      const isDescendant = await isDescendantOf(id, parentId);
      if (isDescendant) {
        return NextResponse.json(
          {
            success: false,
            message: "Validation failed",
            errors: {
              parentId: [
                "Cannot set a descendant category as parent (circular reference)",
              ],
            },
          },
          { status: 422 }
        );
      }
    }

    const updated = await Category.findByIdAndUpdate(
      id,
      { $set: { name, slug, description, image, parentId, isActive, sortOrder } },
      { new: true, runValidators: true }
    ).lean();

    revalidateTag(CATEGORIES);

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        {
          success: false,
          message: `Duplicate value for ${field}`,
          errors: { [field]: [`A category with this ${field} already exists`] },
        },
        { status: 409 }
      );
    }

    console.error("PUT /api/admin/categories/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const authError = requireAdmin(request);
    if (authError) return authError;

    const { id } = params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid category ID" },
        { status: 400 }
      );
    }

    await dbConnect();

    const category = await Category.findById(id).lean();
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    // Block delete if category has children
    const childCount = await Category.countDocuments({ parentId: id });
    if (childCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Cannot delete category with subcategories",
          errors: {
            category: [
              `This category has ${childCount} subcategory(${childCount > 1 ? "ies" : "y"}). Delete or reassign them first.`,
            ],
          },
        },
        { status: 409 }
      );
    }

    // Block delete if products are attached
    const productCount = await Product.countDocuments({
      $or: [{ category: id }, { categories: id }],
    });
    if (productCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Cannot delete category with attached products",
          errors: {
            category: [
              `This category has ${productCount} product(${productCount > 1 ? "s" : ""}) linked. Reassign them first.`,
            ],
          },
        },
        { status: 409 }
      );
    }

    await Category.findByIdAndDelete(id);

    revalidateTag(CATEGORIES);

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/admin/categories/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Walks up the category tree from `categoryId` to check
 * if `targetParentId` is an ancestor — prevents circular references.
 */
async function isDescendantOf(categoryId, targetParentId) {
  let currentId = targetParentId;
  const visited = new Set();
  const maxDepth = 20; // safety limit for deep trees

  while (currentId && visited.size < maxDepth) {
    if (currentId.toString() === categoryId.toString()) return true;
    visited.add(currentId.toString());

    const parent = await Category.findById(currentId).select("parentId").lean();
    if (!parent || !parent.parentId) return false;
    currentId = parent.parentId;
  }

  return false;
}