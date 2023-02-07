// import * as React from "react";
// import * as pnp from "sp-pnp-js";

// export default class EmpLeaves extends React.Component {
//     /*Get Current Logged In User*/
//     public async spLoggedInUserDetails(ctx: any): Promise<any> {
//         try {
//             const web = new pnp.Web(ctx.pageContext.site.absoluteUrl);
//             return await web.currentUser.get();
//         } catch (error) {
//             console.log("Error in spLoggedInUserDetails : " + error);
//         }
//     }
//     private async loadUserDetails(): Promise<void> {
//         try {
//             let userDetails = await this.spLoggedInUserDetails(this.props.ctx);
//             this.setState({
//                 Name: userDetails.Title,
//                 UserId: userDetails.Id,
//                 EmailId: userDetails.Email,
//             });
//         } catch (error) {
//             console.log("Error in loadUserDetails : ", error);
//         }
//     }
// }