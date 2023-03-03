import * as React from "react";
import axios from "axios";
import styles from "./EmpLeaves.module.scss";
import { IEmpLeavesProps } from "./IEmpLeavesProps";
import { ModalBasicExample } from "./Modal";
import { CurrentUser } from "sp-pnp-js/lib/sharepoint/siteusers";
import {
  // CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
export interface IEmpLeavesState {
  showModal: boolean;
  isLoading: boolean;
  items: [
    {
      key: number;
      Title: string;
      Email: string;
      PaidLeavesBalance: number;
      SickLeaveBalance: number;
      CanTake: string;
    }
  ];
}

export default class EmpLeaves extends React.Component<
  IEmpLeavesProps,
  IEmpLeavesState
> {
  public constructor(props: IEmpLeavesProps, state: IEmpLeavesState) {
    super(props);
    this.state = {
      showModal: false,
      isLoading: true,
      items: [
        {
          key: 0,
          Title: "",
          Email: "",
          PaidLeavesBalance: 0,
          SickLeaveBalance: 0,
          CanTake: "",
        },
      ],
    };

  }

  //axios
  public async componentDidMount() {
    await this.getData();
  }

  public async getData() {
    let url = null;
    const siteUrl = "https://tuliptechcom.sharepoint.com/sites/HumanResourceHR";
    const currentUser = await this.getCurrentUser();
    const email = currentUser.Email;

    url =
      siteUrl +
      `/_api/Web/Lists/getbytitle('Leave')/Items?$filter=Email eq '${email}'`;

    try {
      const res = await axios.get(url);
      if (res.data.value != undefined && res.data.value != null) {
        this.setState({ items: res.data.value, isLoading: false });
        console.log(res.data.value[0]);
      }
      this.setState({});
    } catch (error) {
      console.log(error);
    }
  }

  async getCurrentUser() {
    const restApi = `https://tuliptechcom.sharepoint.com/_api/web/currentuser`;
    const response = await axios.get(restApi, {
      headers: {
        Accept: "application/json;odata=nometadata",
        "odata-version": "",
      },
    });
    return response.data;
  }

  public render(): React.ReactElement<IEmpLeavesProps> {
    console.log(CurrentUser);

    return (
      <div>
        <div className={styles.MainDiv}>
          {this.state.items.map((item) => {
            return (
              <div key={item.key}>
                <div className={styles.flex2}>
                  <div className={styles.LeaveManagementText}>
                    Leave Management
                  </div>
                  <div>
                    <ModalBasicExample />
                  </div>
                </div>
                <div className={styles.ProgressBarMainDiv}>
                  <div className={styles.ProgressBarChildern}>
                    <div className={styles.ProgressBarChildernWrapper}>
                      <CircularProgressbarWithChildren
                        value={(item.PaidLeavesBalance / 7) * 100}
                        text={
                          item.CanTake === "N"
                            ? "N/A"
                            : item.PaidLeavesBalance.toString()
                        }
                        strokeWidth={12}
                        styles={buildStyles({
                          textColor: "red",
                          pathColor: "#1F51FF",
                          trailColor: "silver",
                        })}
                      />
                    </div>
                    <div className={styles.ProgressBarChildernText}>
                      <div className={styles.MainText}>Casual Leave</div>
                      <div>Your total casual leave is 7 days.</div>
                      <div>{Math.abs(item.PaidLeavesBalance - 7)} days taken.</div>
                    </div>
                  </div>
                  <div className={styles.ProgressBarChildern}>
                    <div className={styles.ProgressBarChildernWrapper}>
                      <CircularProgressbarWithChildren
                        className={styles.CircularProgressbarText}
                        value={(item.SickLeaveBalance / 5) * 100}
                        text={
                          item.CanTake === "N"
                            ? "N/A"
                            : item.SickLeaveBalance.toString()
                        }
                        strokeWidth={12}
                        styles={buildStyles({
                          textColor: "red",
                          pathColor: "green",
                          trailColor: "silver",
                        })}
                      />
                    </div>
                    <div className={styles.ProgressBarChildernText}>
                      <div className={styles.MainText}>Sick Leave</div>
                      <div>Your total sick leave is 5 days.</div>
                      <div>{Math.abs(item.SickLeaveBalance - 5)} days taken.</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
