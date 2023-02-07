import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as React from "react";

const AddItemForm = () => {
    const [title, setTitle] = React.useState("");
    const [email, setEmail] = React.useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const item: any = {
                Title: title,
                Email: email
            };

            debugger;
            const result = await sp.web.lists.getByTitle("Leaves").items.add(item);
            console.log(result);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="title">Name:</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="description">Email:</label>
                <input
                    type="text"
                    id="description"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>
            <button type="submit">Add item</button>
        </form>
    );
};

export default AddItemForm;