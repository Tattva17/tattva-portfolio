import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Explorer from "./Explorer";
import { filterProjects, filterStories, projects } from "./projects";
const gallery = () =>
  within(screen.getByRole("group", { name: "Project gallery" }));
const category = (name: string) =>
  within(screen.getByRole("group", { name: "Project category" })).getByRole(
    "button",
    { name },
  );
async function open(name: string) {
  await userEvent.click(
    gallery().getByRole("button", { name: new RegExp(name) }),
  );
}
describe("creative explorer", () => {
  it("initially offers all six projects and Think content", () => {
    render(<Explorer />);
    expect(gallery().getAllByRole("button")).toHaveLength(6);
    expect(screen.getByText(/6 matching projects/)).toBeVisible();
    expect(category("All")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Think" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
  it("switches hero perspectives and relevant project controls", async () => {
    render(<Explorer />);
    await userEvent.click(screen.getByRole("button", { name: "Build" }));
    expect(
      screen.getByText(/connecting software to the physical world/),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Ball Tracking Robot ↗" }),
    ).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Connect" }));
    expect(
      screen.getByText(/digitizing prescriptions with MyMediLog/),
    ).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "MyMediLog ↗" }));
    expect(
      screen.getByRole("article", { name: "MyMediLog case study" }),
    ).toBeVisible();
  });
  it("opens the correct story and changes its steps", async () => {
    render(<Explorer />);
    await open("MyMediLog");
    const story = within(
      screen.getByRole("article", { name: "MyMediLog case study" }),
    );
    expect(
      story.getByText(/Paper prescriptions can be difficult/),
    ).toBeVisible();
    await userEvent.click(
      story.getByRole("button", { name: "My contribution" }),
    );
    expect(story.getByText(projects[0].contribution)).toBeVisible();
    await userEvent.click(story.getByRole("button", { name: "The approach" }));
    expect(
      story.getByText(/The app combines Flutter and Firebase/),
    ).toBeVisible();
  });
  it("filters categories and supports projects in multiple categories", async () => {
    render(<Explorer />);
    for (const name of ["AI", "Software"]) {
      await userEvent.click(category(name));
      expect(
        gallery().getByRole("button", { name: /MyMediLog/ }),
      ).toBeVisible();
      expect(
        gallery().getByRole("button", { name: /Talk to Fab/ }),
      ).toBeVisible();
    }
    await userEvent.click(category("Hardware"));
    expect(gallery().getAllByRole("button")).toHaveLength(2);
    expect(
      gallery().queryByRole("button", { name: /MyMediLog/ }),
    ).not.toBeInTheDocument();
  });
  it("combines category and technology, handles empty state and clears filters", async () => {
    render(<Explorer />);
    await userEvent.click(category("Hardware"));
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Technology" }),
      "Python",
    );
    expect(gallery().getAllByRole("button")).toHaveLength(1);
    expect(
      gallery().getByRole("button", { name: /Ball Tracking Robot/ }),
    ).toBeVisible();
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Technology" }),
      "Flutter",
    );
    expect(screen.getByText("No projects match those filters.")).toBeVisible();
    expect(screen.getByText(/0 matching projects/)).toBeVisible();
    await userEvent.click(
      screen.getByRole("button", { name: "Clear filters" }),
    );
    expect(gallery().getAllByRole("button")).toHaveLength(6);
  });
  it("clears a selected story when excluded by filtering", async () => {
    render(<Explorer />);
    await open("MyMediLog");
    await userEvent.click(category("Hardware"));
    expect(
      screen.queryByRole("article", { name: "MyMediLog case study" }),
    ).not.toBeInTheDocument();
  });
  it("keeps the latest story after rapid selection", async () => {
    render(<Explorer />);
    await open("MyMediLog");
    await open("Talk to Fab");
    expect(
      screen.getByRole("article", { name: "Talk to Fab case study" }),
    ).toBeVisible();
    expect(
      screen.queryByRole("article", { name: "MyMediLog case study" }),
    ).not.toBeInTheDocument();
  });
  it("supports keyboard selection and returns focus on close", async () => {
    render(<Explorer />);
    const button = gallery().getByRole("button", { name: /Tutoropia/ });
    button.focus();
    await userEvent.keyboard("{Enter}");
    expect(
      screen.getByRole("article", { name: "Tutoropia case study" }),
    ).toBeVisible();
    await userEvent.click(
      screen.getByRole("button", { name: "Close story ×" }),
    );
    expect(button).toHaveFocus();
  });
  it("ending controls clear conflicting technology filters", async () => {
    render(<Explorer />);
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Technology" }),
      "Python",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Community impact ↗" }),
    );
    expect(category("Community")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("combobox")).toHaveValue("");
    expect(gallery().getAllByRole("button")).toHaveLength(1);
  });
  it("pure filtering handles empty data and unspecified technology", () => {
    expect(filterProjects([], "All")).toEqual([]);
    expect(filterProjects([], "AI")).toEqual([]);
    expect(filterStories(projects, "Community", "Python")).toEqual([]);
  });
  it("clearing filters restores All and keeps an included story", async () => {
    render(<Explorer />);
    await userEvent.click(category("AI"));
    await open("AI Research");
    await userEvent.click(
      screen.getByRole("button", { name: "Clear filters" }),
    );
    expect(category("All")).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("article", { name: "AI Research case study" }),
    ).toBeVisible();
  });
  it("technology tags apply and toggle the same filter as the dropdown", async () => {
    render(<Explorer />);
    await userEvent.click(screen.getByText("Browse technology tags"));
    const python = within(
      screen.getByRole("group", { name: "Technology tags" }),
    ).getByRole("button", { name: "Python" });
    await userEvent.click(python);
    expect(screen.getByRole("combobox", { name: "Technology" })).toHaveValue(
      "Python",
    );
    expect(gallery().getAllByRole("button")).toHaveLength(3);
    await userEvent.click(python);
    expect(gallery().getAllByRole("button")).toHaveLength(6);
  });
  it("provides chapter navigation and direct details without requiring scroll effects", async () => {
    render(<Explorer />);
    const navigation = within(
      screen.getByRole("navigation", { name: "Story chapters" }),
    );
    const building = navigation.getByRole("link", { name: /02 \/ Building/ });
    expect(building).toHaveAttribute("href", "#chapter-building");
    await userEvent.click(building);
    const chapter = within(screen.getByRole("region", { name: "Building." }));
    await userEvent.click(
      chapter.getByRole("button", {
        name: "Explore details: Gesture-Control Wheelchair",
      }),
    );
    expect(
      screen.getByRole("article", {
        name: "Gesture-Control Wheelchair case study",
      }),
    ).toBeVisible();
  });
  it("the contact section can restore all projects after filtering", async () => {
    render(<Explorer />);
    await userEvent.click(category("Hardware"));
    await userEvent.click(
      screen.getByRole("link", { name: "Browse all projects ↑" }),
    );
    expect(gallery().getAllByRole("button")).toHaveLength(6);
    expect(
      screen.getByRole("heading", { name: "Let’s build something useful." }),
    ).toBeVisible();
  });
});
