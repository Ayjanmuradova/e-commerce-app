import { NextRequest, NextResponse } from "next/server";
import { requireAdminOr403 } from "@/lib/authz";
import { createProductSchema } from "@/lib/validations/product";

export async function POST(request: NextRequest) {
  const adminOrResponse = await requireAdminOr403();
  if (adminOrResponse instanceof Response) {
    return adminOrResponse;
  }

  try {
    const body = await request.json();

    const result = createProductSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed.",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    console.log("Product to save:", result.data);

    return NextResponse.json(
      { message: "Product created successfully!", product: result.data },
      { status: 201 }
    );
  } catch (error) {

    return NextResponse.json(
      { error: "Internal Server Error. Something went wrong while processing your request." },
      { status: 500 }
    );
  }
}