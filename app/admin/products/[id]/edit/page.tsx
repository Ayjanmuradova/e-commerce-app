import { getProductById } from "@/services/products/data";
import { notFound } from "next/navigation";
import { EditProductForm } from "@/components/admin/edit-product-form";

interface Props{
    params: Promise<{ id: string }>;
}

export default async function EditProductPage({params}: Props) {
    const resolvedParams = await params;
    const product = await getProductById(resolvedParams.id);
    if (!product) {
        notFound();
    }
    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Edit Product</h1>
            <p className="text-slate-600 text-sm mb-6">
                Update the product details below.
            </p>
            <EditProductForm product={product} />
        </div>
    );
}