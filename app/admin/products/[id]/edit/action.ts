'use server';

import {put as putToBlob} from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { updateProduct } from '@/services/products/data';

function getFileName(file: File, index: number): string{
    const extension = file.name.split('.').pop()?.toLowerCase();
    return `product-images/${Date.now()}-${index}.${extension}`;
}

export async function updateProductAction(id: string, prevState: any, formData: FormData) {
    try {
        const title = formData.get('title') as string;
        const price = parseFloat(formData.get('price') as string);
        const files = formData.getAll('imageUrl') as File[];

        let newImageUrls: string[]| undefined = undefined;
        if (files.length > 0 && files[0].size > 0) {
            const uploaded = await Promise.all(files.map((file, index) => {
                const fileName = getFileName(file, index);
                return putToBlob(fileName, file, { access: 'public', addRandomSuffix: true });
            }));
            newImageUrls = uploaded.map(item=> item.url);
        }

        await updateProduct(id, {
            title,
            price,
            ...(newImageUrls && { imageUrl: newImageUrls })
        });
        revalidatePath('/admin/products');
        return { status: 'success', message: 'Product updated successfully.' };
    } catch (error) {
        console.error(error);
        return { status: 'error', message: 'Failed to update product.' };
    }
}