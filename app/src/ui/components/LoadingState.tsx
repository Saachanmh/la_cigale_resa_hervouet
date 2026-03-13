/**
 * Composant Loading - État de chargement avec skeleton
 */

export const LoadingState = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-gray-200 rounded-lg h-24"></div>
      ))}
    </div>
  );
};

