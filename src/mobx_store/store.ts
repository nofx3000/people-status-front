import { action, makeAutoObservable, observable } from "mobx";
import {
  personApi,
  responsibleApi,
  authApi,
  problemApi,
  ProblemInter,
} from "../api";

class Store {
  @observable people: PersonInfoInter[] = [];
  @observable problems: ProblemInter[] = [];
  @observable userInfo: {} | UserInfoInter = {};
  @observable responsible: ResponsibleInter[] = [];

  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  setPeople(people: any) {
    this.people = people;
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
}

const mobx_store = new Store();
export default mobx_store;
