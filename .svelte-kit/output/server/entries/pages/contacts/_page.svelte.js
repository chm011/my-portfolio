import { j as head } from "../../../chunks/index.js";
function _page($$payload) {
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Contact me</title>`;
  });
  $$payload.out += `<h1>Contacts</h1> <form action="mailto:chm011@ucsd.edu" method="POST" enctype="text/plain"><label for="email">Email:</label> <input name="email" type="email"> <label for="Subject">Subject:</label> <input name="subject"> <label for="Body">Body:</label> <textarea name="body"></textarea> <button>Submit</button></form>`;
}
export {
  _page as default
};
