 import {CreateProductForm} from "@/components/admin/create-product-form";


export default async function CreateProductPage(){

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Create New Product
            </h1>
            <p className="text-gray-500 text-sm mb-8">
                Fill in the details below to add a product to the store.
            </p>
            <CreateProductForm/>
        </div>
    );
}