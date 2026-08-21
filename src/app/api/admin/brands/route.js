// app/api/admin/brands/route.js

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/dbConnect";
import Brand from "@/models/Brand";
import { requireAdmin } from "@/lib/auth/guards";
import { createBrandSchema } from "@/lib/validation/entitySchema";
import { BRANDS } from "@/lib/cache/tags";
import { revalidateTag } from "next/cache";

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

export async function GET(request) {
  try {
    const authError = requireAdmin(request);
    if (authError) return authError;

    const { searchParams } = request.nextUrl;
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, Number(searchParams.get("limit")) || DEFAULT_PAGE_SIZE)
    );
    const search = searchParams.get("search") || "";
    const isActive = searchParams.get("isActive");

    await dbConnect();

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    if (isActive !== null && isActive !== undefined && isActive !== "") {
      filter.isActive = isActive === "true";
    }

    const skip = (page - 1) * limit;
    const [brands, totalCount] = await Promise.all([
      Brand.find(filter)
        .sort({ sortOrder: 1, name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Brand.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: brands,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/admin/brands:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authError = requireAdmin(request);
    if (authError) return authError;

    const body = await request.json();
    const result = createBrandSchema.safeParse(body);

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

    const { name, slug, description, logo, website, country, isActive, sortOrder } =
      result.data;

    // Slug uniqueness check
    const slugTaken = await Brand.findOne({ slug });
    if (slugTaken) {
      return NextResponse.json(
        {
          success: false,
          message: "Brand with this slug already exists",
          errors: { slug: ["This slug is already taken"] },
        },
        { status: 409 }
      );
    }

    const brand = await Brand.create({
      name,
      slug,
      description,
      logo,
      website,
      country,
      isActive,
      sortOrder,
    });

    revalidateTag(BRANDS);

    return NextResponse.json({ success: true, data: brand }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        {
          success: false,
          message: `Duplicate value for ${field}`,
          errors: { [field]: [`A brand with this ${field} already exists`] },
        },
        { status: 409 }
      );
    }

    console.error("POST /api/admin/brands:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}