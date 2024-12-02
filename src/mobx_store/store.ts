import { action, makeAutoObservable, observable } from "mobx";
import {
  personApi,
  responsibleApi,
  authApi,
  problemApi,
  summaryApi,
  ProblemInter,
} from "../api";

class Store {
  @observable people: PersonInfoInter[] = [];
  @observable problems: ProblemInter[] = [];
  @observable userInfo: {} | UserInfoInter = {};
  @observable responsible: ResponsibleInter[] = [];
  @observable updates: RecordInter[] = [];

  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  setPeople(people: any) {
    this.people = people;
  }

  @action
  setUpdates(updates: RecordInter[]) {
    this.updates = updates;
  }

  @action
  deleteUpdatedRecord(record_id: number) {
    this.updates = this.updates.filter((record) => record.id !== record_id);
  }

  @action
  async getProblems(): Promise<void> {
    try {
      const res = await problemApi.getProblems();
      if (res.status === 200) {
        this.problems = res.data.data;
      }
    } catch (error) {
      console.error("Error fetching problems:", error);
    }
  }

  @action
  async getPeopleByUnit(unitId: number): Promise<void> {
    try {
      const res = await personApi.getPeopleByUnitId(unitId);
      if (res.status === 200) {
        this.people = res.data.data.peopleWithUnsolvedRecords;
      }
    } catch (error) {
      console.error("Error fetching people:", error);
    }
  }

  @action
  async getResponsibleByUnit(unitId: number): Promise<void> {
    try {
      const res = await responsibleApi.getResponsibleByUnit(unitId);
      if (res.status === 200) {
        this.responsible = res.data.data;
      }
    } catch (error) {
      console.error("Error fetching responsible:", error);
    }
  }

  @action
  async getUserJWT(): Promise<void> {
    try {
      const res = await authApi.decodeUserJWT();
      if (res.status === 200) {
        this.userInfo = res.data.data;
      }
    } catch (error) {
      console.error("Error fetching user JWT:", error);
    }
  }

  @action
  async checkAdminUpdates(userJWT: UserInfoInter): Promise<void> {
    if (userJWT.role === "admin" && userJWT.id) {
      try {
        // 获取上次登录时间
        const lastLoginRes = await authApi.getLastLogin(userJWT.id);
        if (lastLoginRes.status === 200) {
          const lastLogin = lastLoginRes.data.data;
          // 使用获取到的上次登录时间查询更新
          const res = await summaryApi.getUpdates(lastLogin.toString());

          if (res.status === 200) {
            const updatedRecords = res.data.data;
            if (updatedRecords && updatedRecords.length > 0) {
              this.setUpdates(updatedRecords);
              // 更新最后登录时间
              await authApi.updateLastLogin(userJWT.id);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching updates:", error);
      }
    }
  }
}

const mobx_store = new Store();
export default mobx_store;
