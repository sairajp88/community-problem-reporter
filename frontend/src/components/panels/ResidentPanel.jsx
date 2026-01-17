const ResidentPanel = ({ issues, onSelectIssue }) => {
  return (
    <div className="h-full flex flex-col bg-white border-r">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">My Issues</h2>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {issues.length === 0 ? (
          <p className="p-4 text-sm text-gray-500">
            You have not reported any issues yet.
          </p>
        ) : (
          issues.map((issue) => (
            <div
              key={issue._id}
              onClick={() => onSelectIssue(issue)}
              className="p-4 border-b cursor-pointer hover:bg-gray-50"
            >
              <div className="font-medium">{issue.title}</div>

              <div className="text-sm text-gray-600 mt-1">
                Status: {issue.status}
              </div>

              {issue.severity === "emergency" && (
                <div className="mt-1 text-xs font-semibold text-red-600">
                  EMERGENCY
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ResidentPanel;
