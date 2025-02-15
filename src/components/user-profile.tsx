import { User } from "@supabase/supabase-js";
import React from "react";

interface UserProfileProps {
  user: User;
}
const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <div className="flex flex-col">
      <h1>{user && user?.identities?.[0]?.identity_data?.name}</h1>
      <p>{user.email}</p>
    </div>
  );
};

export default UserProfile;
