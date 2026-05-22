'use server';

import {del, put as putToBlob} from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { getProductById, updateProduct } from '@/services/products/data';
import { requireAdmin } from '@/lib/authz';
import { createProductSchema } from '@/lib/validations/product';

const updateSchema = createProductSchema.pick({ 
    title: true, 
    price: true 
});

function getFileName(file: File, index: number): string{
    const extension = file.name.split('.').pop()?.toLowerCase();
    return `product-images/${Date.now()}-${index}.${extension}`;
}

type ProductFormState = {
    status: 'idle' | 'success' | 'error';
    message: string;
    fieldErrors?:{
        title?: string;
        price?: string;
        images?: string;
    };
};

export async function updateProductAction(id: string, prevState: ProductFormState, formData: FormData) {
    await requireAdmin();
    try {
        const rawData = {
            title: formData.get('title'),
            price: parseFloat(formData.get('price') as string), 
        };
        const validatedData = updateSchema.safeParse(rawData);

        if (!validatedData.success) {
            return {
                status: 'error',
                message: 'Lütfen formdaki hataları düzeltin.',
                fieldErrors: {
                    title: validatedData.error.flatten().fieldErrors.title?.[0],
                    price: validatedData.error.flatten().fieldErrors.price?.[0],
                }
            };
        }

        const { title, price } = validatedData.data;
        const files = formData.getAll('images') as File[];
const existingProduct = await getProductById(id);
        let newImages: string[]| undefined = undefined;
        if (files.length > 0 && files[0].size > 0) {
            const uploaded = await Promise.all(files.map((file, index) => {
                const fileName = getFileName(file, index);
                return putToBlob(fileName, file, { access: 'public', addRandomSuffix: true });
            }));
            newImages = uploaded.map(item=> item.url);
        }
          if (newImages && newImages.length > 0) {
            const existingProduct = await getProductById(id);
            if(existingProduct?.images?.length){
                await del(existingProduct.images);
            }
        }

        await updateProduct(id, {
            title,
            price,
            ...(newImages && { images: newImages })
        });
        revalidatePath('/admin/products');
        return { status: 'success', message: 'Product updated successfully.' };
    } catch (error) {
        console.error(error);
        return { status: 'error', message: 'Failed to update product.' };
    }
}