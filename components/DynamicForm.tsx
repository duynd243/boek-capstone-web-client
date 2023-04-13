import React, { Fragment } from "react";

type Props = {
    align: "left" | "right";
};

const DynamicForm: React.FC<Props> = ({ align }) => {
    const generateRandomId = () => {
        return Math.random().toString(36).substr(2, 9);
    };
    const [inviteMembers, setInviteMembers] = React.useState([
        {
            name: "",
            id: generateRandomId(),
        },
    ]);

    //add new form field for adding member
    const addMemberRow = () => {
        //Todo generate random id

        let _inviteMembers = [...inviteMembers];
        _inviteMembers.push({
            name: "",
            id: generateRandomId(),
        });
        setInviteMembers(_inviteMembers);
    };

    //remove form field for adding member
    const removeMemberRow = (id: string) => {
        //Todo generate random id

        let _inviteMembers = [...inviteMembers];
        _inviteMembers = _inviteMembers.filter((member) => member.id !== id);
        setInviteMembers(_inviteMembers);
    };

    //handle email row change
    const handleMemberChange = (
        id: string,
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        //find the index to be changed
        const index = inviteMembers.findIndex((m) => m.id === id);

        let _inviteMembers = [...inviteMembers] as any;
        _inviteMembers[index][event.target.name] = event.target.value;
        setInviteMembers(_inviteMembers);
    };
    //handle invitation for members
    const handleInvitation = () => {
        console.table(inviteMembers);
    };

    return (
        <Fragment>
            <div className="invite-member">
                {inviteMembers.map((member) => (
                    <div className="form-row" key={member.id}>
                        <div className="input-group">
                            <label htmlFor="name"></label>
                            <input
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                name="name"
                                type="text"
                                onChange={(e) => handleMemberChange(member.id, e)}
                                placeholder="Nhập đường địa chỉ của sách"
                            />
                        </div>
                        {inviteMembers.length > 1 && (
                            <button onClick={() => removeMemberRow(member.id)}>-</button>
                        )}
                        <button onClick={addMemberRow}>+</button>
                    </div>
                ))}
            </div>
        </Fragment>
    );
};

export default DynamicForm;
