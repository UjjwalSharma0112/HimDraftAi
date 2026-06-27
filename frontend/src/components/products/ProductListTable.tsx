import Loader from "../ui/Loader";
import type { ProductDescription } from "../../types/description";

export interface ProductListTableProps {
  products: ProductDescription[];
  loading: boolean;
  selectedProductId?: string | null;
  onSelectProduct: (product: ProductDescription) => void;
  onEditProduct: (product: ProductDescription) => void;
  onDeleteProduct: (product: ProductDescription) => void;
}

export const ProductListTable: React.FC<ProductListTableProps> = ({
  products,
  loading,
  selectedProductId,
  onSelectProduct,
  onEditProduct,
  onDeleteProduct,
}) => {
  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <Loader variant="spinner" size="md" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-12 text-center text-secondary-text text-xs font-sans">
        No product descriptions found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[11px] sm:text-xs font-sans">
        <thead>
          <tr className="border-b border-outline-border text-secondary-text font-mono uppercase tracking-wider">
            <th className="py-2.5 px-2 font-medium">Product Name</th>
            <th className="py-2.5 px-2 font-medium hidden sm:table-cell">Ingredients</th>
            <th className="py-2.5 px-2 font-medium hidden md:table-cell">Weight</th>
            <th className="py-2.5 px-2 font-medium hidden sm:table-cell">Tone</th>
            <th className="py-2.5 px-2 font-medium text-right whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-border">
          {products.map((p) => {
            const isSelected = selectedProductId === p.id;
            return (
              <tr
                key={p.id}
                onClick={() => onSelectProduct(p)}
                className={`cursor-pointer transition-colors ${
                  isSelected ? "bg-surface-bg/80 font-semibold" : "hover:bg-surface-bg/50"
                }`}
              >
                <td className="py-3 px-2 text-primary-text text-[11px] sm:text-xs md:text-sm max-w-[140px] truncate">
                  {p.productName}
                </td>
                <td className="py-3 px-2 text-secondary-text text-[11px] sm:text-xs hidden sm:table-cell max-w-[120px] truncate">
                  {Array.isArray(p.ingredients) ? p.ingredients.join(", ") : p.ingredients}
                </td>
                <td className="py-3 px-2 font-mono text-[10px] sm:text-[11px] text-secondary-text hidden md:table-cell whitespace-nowrap">
                  {p.weight}
                </td>
                <td className="py-3 px-2 text-secondary-text text-[11px] sm:text-xs hidden sm:table-cell capitalize whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded-full border border-outline-border text-[10px]">
                    {p.tone}
                  </span>
                </td>
                <td className="py-3 px-2 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(p);
                      }}
                      className="px-2 py-1 text-[11px] font-bold rounded hover:bg-outline-border/30 hover:text-primary-text transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditProduct(p);
                      }}
                      className="px-2 py-1 text-[11px] font-bold rounded text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProduct(p);
                      }}
                      className="px-2 py-1 text-[11px] font-bold rounded text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductListTable;
