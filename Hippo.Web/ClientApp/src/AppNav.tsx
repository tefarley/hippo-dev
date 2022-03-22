import { NavLink, useRouteMatch } from "react-router-dom";
import HippoLogo from "./Shared/hippoLogo";
import { ShowFor } from "./Shared/ShowFor";

interface IRouteParams {
  cluster: string;
}

export const AppNav = () => {
  const match = useRouteMatch<IRouteParams>("/:cluster/:path");
  const cluster = match?.params.cluster;

  return (
    <div>
      <div className="row appheader justify-content-center">
        <div className="col-md-8 hippo">
          <HippoLogo />

          <h1>
            <img src="/media/ucdavis.svg" alt="UC DAVIS" />
            HiPPO
          </h1>
          <p className="lede">High Performance Personnel Onboarding</p>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <nav className="simple-nav">
            <ShowFor roles={["Sponsor"]}>
              <NavLink
                id="sponsorApprove"
                to={`/${cluster}/approve`}
                className="nav-item nav-link"
                activeStyle={{
                  fontWeight: "bold",
                }}
              >
                Pending Approvals
              </NavLink>
              <NavLink
                id="sponsored"
                to={`/${cluster}/sponsored`}
                className="nav-item nav-link"
                activeStyle={{
                  fontWeight: "bold",
                }}
              >
                Sponsored Accounts
              </NavLink>
            </ShowFor>
            <ShowFor roles={["Admin"]}>
              <NavLink
                id="adminApprovals"
                className="nav-item nav-link"
                to={`/${cluster}/admin/accountApprovals`}
                activeStyle={{
                  fontWeight: "bold",
                }}
              >
                Override Approvals
              </NavLink>

              <NavLink
                id="AdminIndex"
                className="nav-item nav-link"
                to={`/${cluster}/admin/users`}
                activeStyle={{
                  fontWeight: "bold",
                }}
              >
                Manage Admins
              </NavLink>

              <NavLink
                id="adminSponsors"
                className="nav-item nav-link"
                to={`/${cluster}/admin/sponsors`}
                activeStyle={{
                  fontWeight: "bold",
                }}
              >
                Manage Sponsors
              </NavLink>
            </ShowFor>
          </nav>
        </div>
      </div>
    </div>
  );
};
