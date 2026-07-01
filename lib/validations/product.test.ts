import { createProductSchema } from "./product";

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

  it("should pass validation with valid data", () => {
    const result = createProductSchema.safeParse(validProduct);
    
    expect(result.success).toBe(true);
  });

  it("should fail validation if price is negative (Edge Case)", () => {
    const invalidProduct = { ...validProduct, price: -50 };
    
    const result = createProductSchema.safeParse(invalidProduct);
    
    expect(result.success).toBe(false);
    
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Price must be a positive number");
    }
  });

  it("should fail validation if percentage discount exceeds 100% (Edge Case)", () => {
    const invalidProduct = {
      ...validProduct,
      discount: { amount: 150, type: "percentage" },
    };
    
    const result = createProductSchema.safeParse(invalidProduct);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Percentage discount cannot exceed 100%");
    }
  });

  it("should fail validation if image array is empty", () => {
    const invalidProduct = { ...validProduct, images: [] };
    
    const result = createProductSchema.safeParse(invalidProduct);
    
    expect(result.success).toBe(false);
  });
});