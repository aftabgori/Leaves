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
import { PrimaryButton } from '@fluentui/react/lib/Button';
import styles from "./EmpLeaves.module.scss";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import axios from 'axios';

export const ModalBasicExample: React.FunctionComponent = () => {

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


    //GetUserData
    const [items, setItems] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {

        const siteUrl = "https://tuliptechcom.sharepoint.com/sites/HumanResourceHR";


        const getCurrentUser = async () => {
            const restApi = `https://tuliptechcom.sharepoint.com/_api/web/currentuser`;
            const response = await axios.get(restApi, {
                headers: {
                    Accept: "application/json;odata=nometadata",
                    "odata-version": "",
                },
            });
            return response.data;
        }

        const getData = async () => {
            let url = null;
            const currentUser = await getCurrentUser();
            const email = currentUser.Email;

            url =
                siteUrl +
                `/_api/Web/Lists/getbytitle('Leave')/Items?$filter=Email eq '${email}'`;

            try {
                const res = await axios.get(url);
                if (res.data.value != undefined && res.data.value != null) {
                    setItems(res.data.value);
                    setIsLoading(false);
                    console.log(res.data.value[0]);
                }
            } catch (error) {
                console.log(error);
            }
        }

        getData()
            .catch(error => console.log(error));
    }, []);

    //inputs
    const [leaveType, setleaveType] = React.useState("");
    const [reason, setReason] = React.useState("");
    const [fromDate, setfromDate] = React.useState(null);
    const [toDate, settoDate] = React.useState(null);
    const [totalDays, setTotalDays] = React.useState(0);
    const [halfDay, sethalfDay] = React.useState(null);
    const [isDisabled, setIsDisabled] = React.useState(true);
    const [availableLeaves, setAvailableLeaves] = React.useState(null);
    const [submitted, setSubmitted] = React.useState(false);
    const [errorMessage, seterrorMessage] = React.useState('');

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
                FromDate: fromDate.toISOString().substring(0, 10),
                ToDate: toDate.toISOString().substring(0, 10),
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

        setleaveType('');
        setfromDate(null);
        settoDate(null);
        sethalfDay('');
        setReason('');
        setTotalDays(0);
        setAvailableLeaves(0);
        setSubmitted(true);
    };


    //calculate days
    const handleStartDateChange = (date: any) => {
        setfromDate(date);
    };

    const handleEndDateChange = (date: any) => {
        settoDate(date);
    };

    const calculateLeaves = () => {
        if (!fromDate || !toDate) {
            return;
        }

        const diffTime = toDate.getTime() - fromDate.getTime();
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (fromDate.toDateString() !== toDate.toDateString()) {
            sethalfDay(null);
        }

        if (halfDay === "First Half" || halfDay === "Second Half") {
            diffDays = diffDays - 0.5;
        }

        setTotalDays(diffDays + 1);
    };

    React.useEffect(() => {
        calculateLeaves();
    }, [fromDate, toDate, halfDay]);

    const handleSelect = (event: any) => {
        const selectedLeaveType = event.target.value;
        setleaveType(event.target.value);

        // Set the number of available leaves based on the selected leave type
        if (selectedLeaveType === 'Casual Leave' && items.length > 0) {
            setAvailableLeaves(items[0].PaidLeavesBalance);
        } else if (selectedLeaveType === 'Sick Leave' && items.length > 0) {
            setAvailableLeaves(items[0].SickLeaveBalance);
        } else if (selectedLeaveType === 'Unpaid Leave') {
            setAvailableLeaves('N/A')
        } else {
            setAvailableLeaves(0);
        }
    };

    React.useEffect(() => {
        if (leaveType === 'Casual Leave' && items.length > 0 && totalDays > items[0].PaidLeavesBalance) {
            setIsDisabled(true);
            seterrorMessage('!!! Insufficient Casual Leave Balance');
        } else if (leaveType === 'Sick Leave' && items.length > 0 && totalDays > items[0].SickLeaveBalance) {
            setIsDisabled(true);
            seterrorMessage('!!! Insufficient Sick Leave Balance');
        } else {
            setIsDisabled(false);
            seterrorMessage('');
        }
    }, [leaveType, totalDays, items]);

    //close modal
    const handleCloseModal = () => {
        // setSubmitted(false);
        hideModal();
        // setSubmitted(false);
        setleaveType('');
        setfromDate(null);
        settoDate(null);
        sethalfDay('');
        setReason('');
        setTotalDays(0);
        setAvailableLeaves(0);
    }

    const handleOpenModal = () => {
        setSubmitted(false);
        showModal();
    }

    return (
        <div>
            <PrimaryButton className={styles.ApplyLeaveButton} onClick={handleOpenModal} text="Apply Leave" />
            <Modal
                titleAriaId={titleId}
                isOpen={isModalOpen}
                onDismiss={handleCloseModal}
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
                        onClick={handleCloseModal}
                    />
                </div>
                <div className={contentStyles.body}>
                    {!submitted && (
                        <form onSubmit={handleSubmit1} className={styles.formWidth}>
                            <div className={styles.customizedInput}>
                                <div>
                                    {isLoading ? (
                                        <p>Loading...</p>
                                    ) : (
                                        items.map((item, index) => (
                                            <div key={index}>
                                                {item.CanTake === "N" ? (
                                                    <div>
                                                        <label className={styles.label}>Leave Type</label>
                                                        <select required className={styles.customizedInput} value={leaveType || ''} onChange={handleSelect}>
                                                            <option value="">--Select Leave Type--</option>
                                                            <option value="Unpaid Leave">Unpaid Leave</option>
                                                        </select>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <label className={styles.label}>Leave Type</label>
                                                        <select required className={styles.customizedInput} value={leaveType || ''} onChange={handleSelect}>
                                                            <option value="">--Select Leave Type--</option>
                                                            <option value="Casual Leave">Casual Leave</option>
                                                            <option value="Sick Leave">Sick Leave</option>
                                                            <option value="Unpaid Leave">Unpaid Leave</option>
                                                        </select>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>

                                <br />

                                <div>
                                    <div>
                                        <label className={styles.label}>From:</label>
                                        <input className={styles.customizedInput} required onChange={(event) => handleStartDateChange(new Date(event.target.value))} type="date" id="FromDate" name="fromdate" />
                                    </div>

                                    <br />

                                    <div>
                                        <label className={styles.label}>To:</label>
                                        <input className={styles.customizedInput} required onChange={(event) => handleEndDateChange(new Date(event.target.value))} type="date" id="toDate" name="todate" />
                                    </div>
                                </div>

                                <br />

                                <div>
                                    {fromDate && toDate && fromDate.toDateString() === toDate.toDateString() && (
                                        <div>                            
                                            <label className={styles.label}>Half Day</label>
                                            <select className={styles.customizedInput} value={halfDay} onChange={(event) => sethalfDay(event.target.value)} >
                                                <option value="">--Select Half Day--</option>
                                                <option>First Half</option>
                                                <option>Second Half</option>
                                            </select>
                                        </div>
                                    )}
                                </div>

                                <br />

                                <div>
                                    <label className={styles.label}>Reason</label>
                                    <textarea className={styles.customizedInput} style={{ resize: "none", height: "100px" }} required value={reason} onChange={e => setReason(e.target.value)} id="w3review" name="w3review" />
                                </div>

                                <br />

                                <div className={styles.flex3}>
                                    <div>
                                        {/* Total Days: {totalDays} */}
                                        <label className={styles.label}>Number of Days Leave: </label>
                                        <input className={styles.customizedInput} type="text" disabled value={totalDays} name="totalDays" onChange={(e) => setTotalDays(parseInt(e.target.value))} />
                                    </div>
                                    <div>
                                        <label className={styles.label}>Available Leaves: </label>
                                        <input className={styles.customizedInput} type="text" disabled value={availableLeaves} name="availableLeaves" />
                                    </div>
                                </div>

                                <br />

                                <div className={styles.submissionButton}>
                                    {errorMessage && <div className={styles['error-message']} style={{ color: 'red', fontSize: '16px', marginBottom: '16px' }}>{errorMessage}</div>}
                                    {/* <button className={styles.submissionButton} disabled={isDisabled} type="submit">Submit</button> */}
                                    <PrimaryButton className={styles.submissionButton1} type='submit' text="Submit" style={{ textAlign: 'center' }} disabled={isDisabled} />
                                    {/* {submitted && message && <div className={styles.OnSubmitMessage}>{message}</div>} */}
                                </div>
                            </div>
                        </form>
                    )}
                    {submitted && (
                        <div className={styles.OnSubmitMessage}>
                            <div className={styles.OnSubmitMessageH1} style={{ marginBottom: '10px' }}>Your leave request has been submitted successfully!</div>
                            <div className={styles.OnSubmitMessageP} style={{ marginTop: '20px', marginBottom: '20px' }}>We will notify you through mail as we review your request.</div>
                            <PrimaryButton onClick={handleCloseModal} text="Close" style={{ marginTop: '10px' }} />
                        </div>
                    )}
                </div>
            </Modal >
        </div >
    );
};

