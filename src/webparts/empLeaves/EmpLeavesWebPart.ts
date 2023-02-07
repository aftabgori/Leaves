import * as React from "react";
import * as ReactDom from "react-dom";
// import { Version } from "@microsoft/sp-core-library";
// import {
// IPropertyPaneConfiguration,
// PropertyPaneTextField,
// } from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
// import { IReadonlyTheme } from "@microsoft/sp-component-base";

// import * as strings from "EmpLeavesWebPartStrings";
import EmpLeaves from "./components/EmpLeaves";
import { IEmpLeavesProps } from "./components/IEmpLeavesProps";
import { sp } from "@pnp/sp";

export interface IEmpLeavesWebPartProps {
  description: string;
}

export default class EmpLeavesWebPart extends BaseClientSideWebPart<IEmpLeavesWebPartProps> {
  public render(): void {
    const element: React.ReactElement<IEmpLeavesProps> = React.createElement(
      EmpLeaves,
      {
        description: this.properties.description,
        siteurl: this.context.pageContext.web.absoluteUrl,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  public onInit(): Promise<void> {
    return super.onInit().then((_) => {
      // other init code may be presents

      sp.setup({
        spfxContext: this.context as any,
      });
    });
  }
}
