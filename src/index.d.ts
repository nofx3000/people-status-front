interface RecordInter {
  id?: number;
  detail?: string;
  risk_level?: number;
  person_id?: number;
  problem_id?: number;
  problem?: ProblemInter;
  measure?: string;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
  responsible?: PersonInfoInter;
}

interface PersonInfoInter {
  id?: number;
  name?: string;
  catagory?: number;
  unit_id?: number;
  married?: boolean;
  comment?: string;
  records?: RecordInter[];
}

interface ProblemInter {
  id?: number;
  name?: string;
}

interface UserInfoInter {
  username: string;
  password: string;
  role?: "admin" | "user";
}

interface LoginInter {
  username: string;
  password: string;
}
