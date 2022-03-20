const hideAlert = () => {
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
};
export const showBackendAlert = (type, msg) => {
  hideAlert();
  let color;
  if (type === "error") color = "#a64452";
  else color = "#4bb543";
  const markup = `<div class="alert alert--${type}" style="display:block;margin:auto;text-align:center;font-size:24px;background-color:${color};width:50%">${msg}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(hideAlert, 5000);
};
