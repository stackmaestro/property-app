import LoadingSpinner from '../globals/LoadingSpinner';

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <LoadingSpinner size="lg" color="text-primary-600" className="mx-auto mb-4" />
      <p className="text-lg font-medium text-gray-900">Generating Amenity Suggestions...</p>
      <p className="text-sm text-gray-500">Analyzing your tenant profile</p>
    </div>
  </div>
  );
};

export default Loading;