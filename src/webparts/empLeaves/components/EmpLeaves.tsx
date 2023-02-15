import * as React from "react";
import axios from "axios";
import styles from "./EmpLeaves.module.scss";
import { IEmpLeavesProps } from "./IEmpLeavesProps";
// import Divider from '@mui/material/Divider';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import Modal from '@mui/material/Modal';
import { ModalBasicExample } from "./Modal";
// import pnp from "sp-pnp-js"
import { CurrentUser } from "sp-pnp-js/lib/sharepoint/siteusers";
// import { CurrentUser } from "sp-pnp-js/lib/sharepoint/siteusers";
// import AddItemForm from "./AddItem";
// import { sp } from "@pnp/sp";
// import BasicModal from "./Modal2";

export interface IEmpLeavesState {
  isLoading: boolean;
  items: [
    {
      key: number;
      Title: string;
      Email: string;
      PaidLeavesBalance: string;
      SickLeaveBalance: string;
      CanTake: string;
    }
  ];
}

// export class MyListTable extends React.Component {
export default class EmpLeaves extends React.Component<
  IEmpLeavesProps,
  IEmpLeavesState
> {
  public constructor(props: IEmpLeavesProps, state: IEmpLeavesState) {
    super(props);
    this.state = {
      isLoading: true,
      items: [
        {
          key: 0,
          Title: "",
          Email: "",
          PaidLeavesBalance: "",
          SickLeaveBalance: "",
          CanTake: "",
        },
      ],
    };
  }

  //axios
  public async componentDidMount() {
    await this.getData(this.props.siteurl);
  }

  public async getData(Url: string) {
    let url = null;
    const currentUser = await this.getCurrentUser();
    const email = currentUser.Email;

    url =
      Url +
      `/sites/HumanResourceHR/_api/Web/Lists/getbytitle('Leave')/Items?$filter=Email eq '${email}'`;

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
        <div>
          {this.state.items.map(function (item) {
            return (
              <tr key={item.key}>
                <div className={styles.flex2}>
                  <div className={styles.LeaveManagementText}>
                    Leave Management
                  </div>
                  <div>
                    <ModalBasicExample />
                  </div>
                </div>
                <div className={styles["grid-container"]}>
                  <div>
                    <div className={styles["circle-wrap"]}>
                      <div className={styles.circle}>
                        <div>
                          <div />
                        </div>
                        <div>
                          <div className={styles.fill} />
                        </div>
                        <div className={styles["inside-circle"]}>
                          {item.CanTake === "N" ? 'N/A' : item.PaidLeavesBalance}
                        </div>
                      </div>
                    </div>
                    <div className={styles.remainingLeaveText}>
                      Casual Leave <br /> Available
                    </div>
                  </div>

                  <div>
                    <div className={styles["circle-wrap"]}>
                      <div className={styles.circle}>
                        <div>
                          <div />
                        </div>
                        <div>
                          <div className={styles.fill} />
                        </div>
                        <div className={styles["inside-circle"]}>
                          {item.CanTake === "N" ? 'N/A' : item.SickLeaveBalance}
                        </div>
                      </div>
                    </div>
                    <div className={styles.remainingLeaveText}>
                      Sick Leave <br /> Available
                    </div>
                  </div>
                </div>
              </tr>
            );
          })}
        </div>
      </div>
    );
  }
}
