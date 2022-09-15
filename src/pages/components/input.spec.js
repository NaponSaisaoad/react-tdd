import { render } from "@testing-library/react";
import Input from "./input";

it("has is-invalid class for input when help is set", () => {
   const { container } = render(<Input help="Error message"/>);
   const input = container.querySelector("input");
   expect(input.classList).toContain('is-inValid')
})

it("has is-feedback class for input when help is set", () => {
    const { container } = render(<Input help="Error message"/>);
    const span = container.querySelector("span");
    expect(span.classList).toContain('is-inValid')
})

it("does not has is-invalid class for input when help is not set", () => {
    const { container } = render(<Input />);
    const input = container.querySelector("input");
    expect(input.classList).toContain('is-inValid')
})

