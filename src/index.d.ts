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
  avatar?: string;
  unit?: UnitInter;
}

interface ProblemInter {
  id?: number;
  name?: string;
  record?: RecordInter[];
}

interface UserInfoInter {
  id?: number;
  username?: string;
  password?: string;
  unit_id?: number;
  role?: "admin" | "user";
}

interface LoginInter {
  username: string;
  password: string;
}

interface UnitInter {
  id?: number;
  name: string;
}
