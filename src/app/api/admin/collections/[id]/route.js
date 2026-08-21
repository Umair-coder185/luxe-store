// app/api/admin/collections/[id]/route.js

import { NextResponse } from "next/server";
import { ObjectId } from "mongoose";
import dbConnect from "@/lib/db/dbConnect";
import Collection from "@/models/Collection";
import { requireAdmin } from "@/lib/auth/guards";
import { updateCollectionSchema } from "@/lib/validation/entitySchema";
import { COLLECTIONS } from "@/lib/cache/tags";
import { revalidateTag } from "next/cache";

export async function PUT(request, { params }) {
  try {
    const authError = requireAdmin(request);
    if (authError) return authError;

    const { id } = params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid collection ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const result = updateCollectionSchema.safeParse(body);

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

    const existing = await Collection.findById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Collection not found" },
        { status: 404 }
      );
    }

    const { name, slug, description, image, startDate, endDate, isActive, sortOrder, featured } =
      result.data;

    if (slug && slug !== existing.slug) {
      const slugTaken = await Collection.findOne({ slug, _id: { $ne: id } });
      if (slugTaken) {
        return NextResponse.json(
          {
            success: false,
            message: "Collection with this slug already exists",
            errors: { slug: ["This slug is already taken"] },
          },
          { status: 409 }
        );
      }
    }

    const updated = await Collection.findByIdAndUpdate(
      id,
      { $set: { name, slug, description, image, startDate, endDate, isActive, sortOrder, featured } },
      { new: true, runValidators: true }
    ).lean();

    revalidateTag(COLLECTIONS);

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        {
          success: false,
          message: `Duplicate value for ${field}`,
          errors: { [field]: [`A collection with this ${field} already exists`] },
        },
        { status: 409 }
      );
    }

    console.error("PUT /api/admin/collections/[id]:", error);
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
        { success: false, message: "Invalid collection ID" },
        { status: 400 }
      );
    }

    await dbConnect();

    const collection = await Collection.findById(id).lean();
    if (!collection) {
      return NextResponse.json(
        { success: false, message: "Collection not found" },
        { status: 404 }
      );
    }

    await Collection.findByIdAndDelete(id);

    revalidateTag(COLLECTIONS);

    return NextResponse.json({
      success: true,
      message: "Collection deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/admin/collections/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}