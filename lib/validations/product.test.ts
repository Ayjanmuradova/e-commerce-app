import { createProductSchema, parseDiscountFromFormData, updateProductSchema } from "./product";

describe("Product Validation Schema", () => {
  const dummyImage = new File(["dummy content"], "test-image.jpg", {
    type: "image/jpeg",
  });

  const validProduct = {
    title: "Best Sneakers",
    description: "These are the best sneakers in the world.",
    brand: "Nike",
    price: 1200,
    category: "Shoes",
    stock: 50,
    tags: ["running", "sports"],
    images: [dummyImage],
  };

  it("should fail validation if category is missing", () => {
    const { category: _category, ...withoutCategory } = validProduct;
    const result = createProductSchema.safeParse(withoutCategory);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.category?.length).toBeGreaterThan(
        0,
      );
    }
  });

  it("should pass update schema with core fields and no images", () => {
    const { images: _images, ...core } = validProduct;
    const result = updateProductSchema.safeParse(core);
    expect(result.success).toBe(true);
  });

  it("should pass validation with valid data", () => {
    const result = createProductSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
  });

  it("should fail validation if price is negative (Edge Case)", () => {
    const result = createProductSchema.safeParse({ ...validProduct, price: -50 });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.price).toContain(
        "Price must be a positive number",
      );
    }
  });

  it("should fail validation if percentage discount exceeds 100% (Edge Case)", () => {
    const result = createProductSchema.safeParse({
      ...validProduct,
      discount: { amount: 150, type: "percentage" },
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.discount).toContain(
        "Percentage discount cannot exceed 100%",
      );
    }
  });

  it("should pass when discount is undefined", () => {
    const result = createProductSchema.safeParse({
      ...validProduct,
      discount: undefined,
    });

    expect(result.success).toBe(true);
  });

  it("should coerce string discount values from form data", () => {
    const result = createProductSchema.safeParse({
      ...validProduct,
      discount: { amount: "10", type: "percentage" },
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.discount?.amount).toBe(10);
      expect(result.data.discount?.type).toBe("percentage");
    }
  });

  it("should fail when discount type is set but amount is missing", () => {
    const result = createProductSchema.safeParse({
      ...validProduct,
      discount: { type: "percentage" },
    });

    expect(result.success).toBe(false);
  });

  it("should fail validation if image array is empty", () => {
    const result = createProductSchema.safeParse({ ...validProduct, images: [] });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.images).toContain(
        "At least one image is required",
      );
    }
  });

  it("should fail when file is not an image", () => {
    const pdfFile = new File(["pdf"], "doc.pdf", { type: "application/pdf" });
    const result = createProductSchema.safeParse({
      ...validProduct,
      images: [pdfFile],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ message: "File must be an image" }),
        ]),
      );
    }
  });

  it("should fail when image file is empty", () => {
    const emptyFile = new File([], "empty.jpg", { type: "image/jpeg" });
    const result = createProductSchema.safeParse({
      ...validProduct,
      images: [emptyFile],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ message: "Image file cannot be empty" }),
        ]),
      );
    }
  });

  describe("parseDiscountFromFormData", () => {
    it("returns undefined when no discount fields are set", () => {
      const formData = new FormData();
      expect(parseDiscountFromFormData(formData)).toBeUndefined();
    });

    it("returns undefined when only discount type is set (partial data ignored)", () => {
      const formData = new FormData();
      formData.set("discountType", "percentage");
      expect(parseDiscountFromFormData(formData)).toBeUndefined();
    });

    it("returns discount object when both fields are set", () => {
      const formData = new FormData();
      formData.set("discountType", "percentage");
      formData.set("discountAmount", "10");

      expect(parseDiscountFromFormData(formData)).toEqual({
        amount: "10",
        type: "percentage",
      });
    });

    it("passes schema validation with string values from FormData", () => {
      const formData = new FormData();
      formData.set("discountType", "fixed");
      formData.set("discountAmount", "25");

      const discount = parseDiscountFromFormData(formData);
      const result = createProductSchema.safeParse({
        ...validProduct,
        discount,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.discount?.amount).toBe(25);
        expect(result.data.discount?.type).toBe("fixed");
      }
    });
  });

  it("should fail when more than 5 images are uploaded", () => {
    const images = Array.from(
      { length: 6 },
      (_, i) => new File(["x"], `img-${i}.jpg`, { type: "image/jpeg" }),
    );
    const result = createProductSchema.safeParse({ ...validProduct, images });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.images).toContain(
        "You can upload up to 5 images.",
      );
    }
  });
});
