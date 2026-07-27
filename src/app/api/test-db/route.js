import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    return Response.json({ status: "success", message: "MongoDB connected" });
  } catch (error) {
    return Response.json({ status: "error", message: error.message }, { status: 500 });
  }
}