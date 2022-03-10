import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { MemoryRouter } from "react-router-dom";

import { fakeAccounts, fakeAppContext } from "../../test/mockData";
import { responseMap } from "../../test/testHelpers";
import { ApproveAccounts } from "./ApproveAccounts";

import { act, Simulate } from "react-dom/test-utils";

import AppContext from "../../Shared/AppContext";
import { ModalProvider } from "react-modal-hook";

let container: Element;

beforeEach(() => {
  const accountResponse = Promise.resolve({
    status: 200,
    ok: true,
    json: () => Promise.resolve(fakeAccounts),
  });
  const approveResponse = Promise.resolve({
    status: 200,
    ok: true,
  });

  (global as any).Hippo = fakeAppContext;
  container = document.createElement("div");
  document.body.appendChild(container);

  global.fetch = jest.fn().mockImplementation((x) =>
    responseMap(x, {
      "/api/account/pending": accountResponse,
      "api/account/approve/1": approveResponse,
    })
  );
});

afterEach(() => {
  // cleanup on exiting
  // clear any mocks living on fetch
  if ((global.fetch as any).mockClear) {
    (global.fetch as any).mockClear();
  }
  unmountComponentAtNode(container);
  container.remove();
});

it("shows pending approvals count", async () => {
  await act(async () => {
    render(
      <AppContext.Provider value={(global as any).Hippo}>
        <ModalProvider>
          <MemoryRouter>
            <ApproveAccounts />
          </MemoryRouter>
        </ModalProvider>
      </AppContext.Provider>,
      container
    );
  });
  expect(container.textContent).toContain(
    "There are 2 account(s) awaiting your approval"
  );
});

it("shows approval button for each pending account", async () => {
  await act(async () => {
    render(
      <AppContext.Provider value={(global as any).Hippo}>
        <ModalProvider>
          <MemoryRouter>
            <ApproveAccounts />
          </MemoryRouter>
        </ModalProvider>
      </AppContext.Provider>,
      container
    );
  });
  expect(container.querySelectorAll("button.btn.btn-primary").length).toBe(2);
});

it("shows reject button for each pending account", async () => {
  await act(async () => {
    render(
      <AppContext.Provider value={(global as any).Hippo}>
        <ModalProvider>
          <MemoryRouter>
            <ApproveAccounts />
          </MemoryRouter>
        </ModalProvider>
      </AppContext.Provider>,
      container
    );
  });
  expect(container.querySelectorAll("button.btn.btn-danger").length).toBe(2);
});

it("approve button has expected text", async () => {
  await act(async () => {
    render(
      <AppContext.Provider value={(global as any).Hippo}>
        <ModalProvider>
          <MemoryRouter>
            <ApproveAccounts />
          </MemoryRouter>
        </ModalProvider>
      </AppContext.Provider>,
      container
    );
  });
  expect(container.querySelector("button.btn.btn-primary")?.textContent).toBe(
    "Approve"
  );
});
it("reject button has expected text", async () => {
  await act(async () => {
    render(
      <AppContext.Provider value={(global as any).Hippo}>
        <ModalProvider>
          <MemoryRouter>
            <ApproveAccounts />
          </MemoryRouter>
        </ModalProvider>
      </AppContext.Provider>,
      container
    );
  });
  expect(container.querySelector("button.btn.btn-danger")?.textContent).toBe(
    "Reject"
  );
});

it("table header has expected text", async () => {
  await act(async () => {
    render(
      <AppContext.Provider value={(global as any).Hippo}>
        <ModalProvider>
          <MemoryRouter>
            <ApproveAccounts />
          </MemoryRouter>
        </ModalProvider>
      </AppContext.Provider>,
      container
    );
  });
  expect(container.querySelector("tr")?.textContent).toBe(
    "NameSubmittedAction"
  );
});

//Enable this when the test works
xit("displays dialog when reject is clicked", async () => {
  await act(async () => {
    render(
      <AppContext.Provider value={(global as any).Hippo}>
        <ModalProvider>
          <MemoryRouter>
            <ApproveAccounts />
          </MemoryRouter>
        </ModalProvider>
      </AppContext.Provider>,
      container
    );
  });
  console.log(container.innerHTML);
  const rejectButton = container.querySelector(
    "button.btn.btn-danger"
  ) as HTMLButtonElement;
  expect(rejectButton).toBeTruthy();

  Simulate.click(rejectButton);
  console.log(container.innerHTML);
  expect(container.querySelector("div.modal-dialog")).toBeTruthy();
});

it("calls approve and filters list when approve is clicked", async () => {
  await act(async () => {
    render(
      <AppContext.Provider value={(global as any).Hippo}>
        <ModalProvider>
          <MemoryRouter>
            <ApproveAccounts />
          </MemoryRouter>
        </ModalProvider>
      </AppContext.Provider>,
      container
    );
  });
  expect(container.textContent).toContain(
    "There are 2 account(s) awaiting your approval"
  );
  //console.log(container.innerHTML);
  const approveButton = container.querySelector(
    "button.btn.btn-primary"
  ) as HTMLButtonElement;
  expect(approveButton).toBeTruthy();
  await act(async () => {
    Simulate.click(approveButton);
  });
  //console.log(container.innerHTML);
  expect(container.textContent).toContain(
    "There are 1 account(s) awaiting your approval"
  );

  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(global.fetch).toHaveBeenCalledWith("/api/account/pending", {
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      RequestVerificationToken: "fakeAntiForgeryToken",
    },
  });
  expect(global.fetch).toHaveBeenLastCalledWith("/api/account/approve/1", {
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      RequestVerificationToken: "fakeAntiForgeryToken",
    },
    method: "POST",
  });
});