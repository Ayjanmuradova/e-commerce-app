import { getSessionUser } from "@/lib/authz";

export default async function ProfilePage() {
  const user = await getSessionUser();

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>

      <div className="bg-white border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-4 pb-4 border-b">
          {user.picture && (
            <img
              src={user.picture}
              alt="Profile"
              className="w-16 h-16 rounded-full"
            />
          )}
          <div>
            <p className="font-semibold text-lg">{user.name}</p>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
        </div>

        <InfoRow label="Email" value={user.email ?? "—"} />
        <InfoRow label="Name" value={user.name ?? "—"} />

        <div className="pt-4 border-t">
          <p className="text-sm font-medium text-gray-500 mb-1">Address</p>
          <p className="text-gray-400 text-sm italic">No address saved yet.</p>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}
