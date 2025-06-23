export default function ProductForm() {
  return (
    <form>
      <div>
        <label htmlFor="productName">상품명</label>
        <input type="text" id="productName" name="productName" />
      </div>

      <div>
        <label htmlFor="price">가격</label>
        <input type="number" id="price" name="price" />
      </div>

      <button type="submit">등록</button>
    </form>
  );
}
