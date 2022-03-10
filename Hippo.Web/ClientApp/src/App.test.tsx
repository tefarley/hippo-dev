import React from "react";
import ReactDOM from "react-dom";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { fakeAccounts, fakeAppContext } from "./test/mockData";
import { responseMap } from "./test/testHelpers";
import { act } from "react-dom/test-utils";

beforeEach(() => {
  const accountResponse = Promise.resolve({
    status: 200,
    ok: true,
    json: () => Promise.resolve(fakeAccounts[0]),
  });

  (global as any).Hippo = fakeAppContext;

  global.fetch = jest.fn().mockImplementation((x) =>
    responseMap(x, {
      "/api/account/get": accountResponse,
    })
  );
});

afterEach(() => {
  // cleanup on exiting
  // clear any mocks living on fetch
  if ((global.fetch as any).mockClear) {
    (global.fetch as any).mockClear();
  }
});

it("renders without crashing", async () => {
  const div = document.createElement("div");
  await act(async () => {
    ReactDOM.render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
      div
    );
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));
});
