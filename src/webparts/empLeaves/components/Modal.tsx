import * as React from 'react';
import { useId, useBoolean } from '@fluentui/react-hooks';
import {
    getTheme,
    mergeStyleSets,
    FontWeights,
    Modal,
    IIconProps,
} from '@fluentui/react';
import { IconButton, IButtonStyles } from '@fluentui/react/lib/Button';
// import { TextField } from '@fluentui/react/lib/TextField';
// import { IStackProps, IStackStyles } from '@fluentui/react/lib/Stack';
// import {
//     DatePicker,
//     // DayOfWeek,
//     Dropdown,
//     IDropdownOption,
//     // mergeStyles,
//     // defaultDatePickerStrings,
// } from '@fluentui/react';
// import { IDropdownStyles } from 'office-ui-fabric-react';
// import { IStackTokens } from '@fluentui/react';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import styles from "./EmpLeaves.module.scss";
// import * as SP from "@microsoft/sp-webpart-base";
import { sp } from "@pnp/sp";
// import axios from "axios";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export const ModalBasicExample: React.FunctionComponent = (props: any) => {

    // const { PaidLeavesBalance = 0 } = props;

    const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false);

    const titleId = useId('title');

    const cancelIcon: IIconProps = { iconName: 'Cancel' };

    const theme = getTheme();
    const contentStyles = mergeStyleSets({
        container: {
            display: 'flex',
            flexFlow: 'column nowrap',
            alignItems: 'stretch',
        },
        header: [
            theme.fonts.xLargePlus,
            {
                flex: '1 1 auto',
                borderTop: `4px solid ${theme.palette.themePrimary}`,
                color: theme.palette.neutralPrimary,
                display: 'flex',
                alignItems: 'center',
                fontWeight: FontWeights.semibold,
                padding: '12px 12px 14px 24px',
            },
        ],
        heading: {
            color: theme.palette.neutralPrimary,
            fontWeight: FontWeights.semibold,
            fontSize: 'inherit',
            margin: '0',
        },
        body: {
            flex: '4 4 auto',
            padding: '0 24px 24px 24px',
            overflowY: 'hidden',
            selectors: {
                p: { margin: '14px 0' },
                'p:first-child': { marginTop: 0 },
                'p:last-child': { marginBottom: 0 },
            },
        },
    });

    const iconButtonStyles: Partial<IButtonStyles> = {
        root: {
            color: theme.palette.neutralPrimary,
            marginLeft: 'auto',
            marginTop: '4px',
            marginRight: '2px',
        },
        rootHovered: {
            color: theme.palette.neutralDark,
        },
    };

    //textfield
    // const stackTokens = { childrenGap: 50 };
    // // const iconProps = { iconName: 'Calendar' };
    // const stackStyles: Partial<IStackStyles> = { root: { width: 650 } };
    // const columnProps: Partial<IStackProps> = {
    //     tokens: { childrenGap: 15 },
    //     styles: { root: { width: 300 } },
    // };

    //DatePicker
    // const days: IDropdownOption[] = [
    //     { text: 'Sunday', key: DayOfWeek.Sunday },
    //     { text: 'Monday', key: DayOfWeek.Monday },
    //     { text: 'Tuesday', key: DayOfWeek.Tuesday },
    //     { text: 'Wednesday', key: DayOfWeek.Wednesday },
    //     { text: 'Thursday', key: DayOfWeek.Thursday },
    //     { text: 'Friday', key: DayOfWeek.Friday },
    //     { text: 'Saturday', key: DayOfWeek.Saturday },
    // ];

    // const [firstDayOfWeek, setFirstDayOfWeek] = React.useState(DayOfWeek.Sunday);

    // const onDropdownChange = React.useCallback((event: React.FormEvent<HTMLDivElement>, option: IDropdownOption) => {
    //     setFirstDayOfWeek(option.key as number);
    // }, []);
    // const rootClass = mergeStyles({ maxWidth: 300, selectors: { '> *': { marginBottom: 15 } } });

    //dropdown
    // const dropdownStyles: Partial<IDropdownStyles> = {
    //     dropdown: { width: 300 },
    // };

    // const options1: IDropdownOption[] = [
    //     { key: 'sickLeave', text: 'Sick Leave' },
    //     { key: 'casualLeave', text: 'Casual Leave' },
    //     { key: 'paidLeave', text: 'Paid Leave' },
    // ];

    // const options2: IDropdownOption[] = [
    //     { key: 'firstHalf', text: 'First Half' },
    //     { key: 'secondHalf', text: 'Second Half' },
    // ];


    // const handleSubmit = (e: any) => {
    //     console.log(e.target.value);
    //     // console.log(leaveType, remainingLeaves, fromDate, toDate, halfDay, noOfDayLeave, reason);
    // }

    //calculate days

    // const [start, setStart] = React.useState(new Date());
    // const [end, setEnd] = React.useState(new Date());

    // const handleStartChange = (date: any) => {
    //     setStart(date);
    // };

    // const handleEndChange = (Date: any) => {
    //     setEnd(Date);
    // };

    // const diffTime = end.getTime() - start.getTime();
    // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));


    //inputs
    // const [leaveType, SetleaveType] = React.useState("");
    const [leaveType, setleaveType] = React.useState("");
    const [reason, setReason] = React.useState("");
    const [fromDate, setfromDate] = React.useState(null);
    const [toDate, settoDate] = React.useState(null);
    const [totalDays, setTotalDays] = React.useState(0);
    const [halfDay, sethalfDay] = React.useState(null);
    const [isDisabled, setIsDisabled] = React.useState(true);
    // const { PaidLeavesBalance = 0 } = props;
    const PaidLeavesBalance: number = 7;

    const siteUrl = "https://tuliptechcom.sharepoint.com/sites/HumanResourceHR";

    sp.setup({
        sp: {
            baseUrl: siteUrl
        }
    });

    const handleSubmit1 = async (e: any) => {
        e.preventDefault();

        try {
            const item = {
                LeaveType: leaveType,
                FromDate: fromDate,
                ToDate: toDate,
                HalfDay: halfDay,
                Reason: reason,
                NoOfDays: totalDays.toString(),
            };

            const result = await sp.web
                .lists.getByTitle("LeavesData").items.add(item);
            console.log(result);
        } catch (error) {
            console.error(error);
        }
    };


    //calculate day

    const handleStartDateChange = (date: any) => {
        setfromDate(date);
    };

    const handleEndDateChange = (date: any) => {
        settoDate(date);
    };

    // const handleIsHalfDayChange = (event: any) => {
    //     sethalfDay(event);
    // };

    const calculateLeaves = () => {
        if (!fromDate || !toDate) {
            return;
        }

        const diffTime = toDate.getTime() - fromDate.getTime();
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        diffDays = sethalfDay && fromDate.toDateString() === toDate.toDateString() ? diffDays - 0.5 : diffDays;
        setTotalDays(diffDays + 1);

        // const availableLeaves = props.items.PaidLeavesBalance != undefined ? props.items.PaidLeavesBalance : 0;
        debugger;
        // if (props.items && props.items.length > 0 && props.items['PaidLeavesBalance'] !== undefined) {
        const paidLeavesBalance = parseFloat(PaidLeavesBalance.toString());

        // console.log(diffDays);
        // console.log(props.items['PaidLeavesBalance'])

        if (!isNaN(paidLeavesBalance)) {
            if (diffDays > paidLeavesBalance) {
                setIsDisabled(true);
                window.Error("You've requesting more leaves than your available balance!!!")
            } else {
                setIsDisabled(false);
            }
        } else {
            console.error("Not valid");
        }
        // }
    };

    React.useEffect(() => {
        calculateLeaves();
    }, [fromDate, toDate, halfDay]);

    return (
        <div>
            <PrimaryButton onClick={showModal} text="Request a Leave" />
            <Modal
                titleAriaId={titleId}
                isOpen={isModalOpen}
                onDismiss={hideModal}
                isBlocking={false}
                containerClassName={contentStyles.container}
            >
                <div className={contentStyles.header}>
                    <h2 className={contentStyles.heading} id={titleId}>
                        Apply Leaves
                    </h2>
                    <IconButton
                        styles={iconButtonStyles}
                        iconProps={cancelIcon}
                        ariaLabel="Close popup modal"
                        onClick={hideModal}
                    />
                </div>
                <div className={contentStyles.body}>
                    <form onSubmit={handleSubmit1} className={styles.formWidth}>
                        <div className={styles.customizedInput}>
                            <div>
                                {props.items && props.items.CanTake === 'N' ? (
                                    <div>
                                        <label className={styles.label}>Leave Type</label>
                                        <select required className={styles.customizedInput} value={leaveType} onChange={e => setleaveType(e.target.value)} name="LeaveType" id="leavetype">
                                            <option>Unpaid Leave</option>
                                        </select>
                                    </div>
                                ) : (
                                    <div>
                                        <label className={styles.label}>Leave Type</label>
                                        <select required className={styles.customizedInput} value={leaveType} onChange={e => setleaveType(e.target.value)} name="LeaveType" id="leavetype">
                                            <option>Casual Leave</option>
                                            <option>Sick Leave</option>
                                            <option>Unpaid Leave</option>
                                        </select>
                                    </div>
                                )
                                }
                            </div>


                            <br />

                            <div>
                                <label className={styles.label}>From:</label>
                                <input className={styles.customizedInput} required onChange={(event) => handleStartDateChange(new Date(event.target.value))} type="date" id="FromDate" name="fromdate" />
                            </div>

                            <br />

                            <div>
                                <label className={styles.label}>To:</label>
                                <input className={styles.customizedInput} required onChange={(event) => handleEndDateChange(new Date(event.target.value))} type="date" id="toDate" name="todate" />
                            </div>

                            <br />

                            <div>
                                {fromDate && toDate && fromDate.toDateString() === toDate.toDateString() && (
                                    <div>
                                        {/* <input type="checkbox" value={halfDay} onChange={(event) => sethalfDay(event.target.value)} />
                                    Half-day leave */}

                                        <label className={styles.label}>Half Day</label>
                                        <select className={styles.customizedInput} value={halfDay} required onChange={(event) => sethalfDay(event.target.value)} >
                                            <option>First half</option>
                                            <option>Second Half</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <br />

                            <div>
                                <label className={styles.label}>Reason</label>
                                <textarea className={styles.customizedInput} required value={reason} onChange={e => setReason(e.target.value)} id="w3review" name="w3review" />
                            </div>

                            <br />

                            <div>
                                {/* Total Days: {totalDays} */}
                                <label className={styles.label}>Total Days: </label>
                                <input className={styles.customizedInput} type="text" disabled value={totalDays} name="totalDays" onChange={(e) => setTotalDays(parseInt(e.target.value))} />
                            </div>

                            <br />

                            <div>
                                <button className={styles.submissionButton} disabled={isDisabled} type="submit">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal >
        </div >
    );
};

