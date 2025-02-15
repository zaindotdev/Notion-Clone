import { Database } from "../../../database.types";
// Sign Up Form Type
export type SignUpFunction = {
  name: string;
  email: string;
  password: string;
};

// Sign In Form Type
export type SignInFunction = {
  email: string;
  password: string;
};

// db types

export type Workspaces = Database["public"]["Tables"]["workspaces"]["Row"];
export type Pages = Database["public"]["Tables"]["pages"]["Row"];
export type Collaborators =
  Database["public"]["Tables"]["collaborators"]["Row"];
export type User = Database["public"]["Tables"]["users"]["Row"];
export type Subscriptions =
  Database["public"]["Tables"]["subscriptions"]["Row"];
