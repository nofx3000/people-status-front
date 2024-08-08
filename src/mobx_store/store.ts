import { action, makeAutoObservable, observable } from "mobx";
import axios from "axios";
// mobx的store初始化代码（ts）
class Store {
  @observable people: PersonInfoInter[] = [];
  @observable problems: ProblemInter[] = [];
  @observable userInfo: {} | UserInfoInter = {};
  @observable responsible: ResponsibleInter[] = [];

  // @observable isAdding = false;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  setPeople(people: any) {
    this.people = people;
  }

  // setIsAdding(isAdding: boolean) {
  //   this.isAdding = isAdding;
  // }

  // 创建mobx异步获取数据方法getProblems，在方法中使用axios从/problem获取数据，并添加到problems
  @action
  async getProblems(): Promise<void> {
    try {
      const { data } = await axios.get("/problem");
      this.problems = data.data as ProblemInter[];
    } catch (error) {
      console.error("Error fetching problems:", error);
    }
  }
  // 根据上面getProblems，写出getPeople的action
  @action
  async getPeopleByUnit(unitId: number): Promise<void> {
    try {
      const { data } = await axios.get(`/people/${unitId}`);
      this.people = data.data as PersonInfoInter[];
    } catch (error) {
      console.error("Error fetching people:", error);
    }
  }
  @action
  async getResponsibleByUnit(unitId: number): Promise<void> {
    try {
      const { data } = await axios.get(`/responsible/unit/${unitId}`);
      this.responsible = data.data as ResponsibleInter[];
    } catch (error) {
      console.error("Error fetching responsible:", error);
    }
  }
  // 获取用户jwt数据
  @action
  async getUserJWT(): Promise<void> {
    try {
      const { data } = await axios.get("/users/verify1");
      this.userInfo = data.data;
      console.log("this.userInfo", this.userInfo);
    } catch (error) {
      console.error("Error fetching people:", error);
    }
  }
}

const mobx_store = new Store();
export default mobx_store;
