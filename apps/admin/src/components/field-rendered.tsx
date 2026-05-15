import { FieldConfig } from "@/types/form.types";
import fieldRegistry from "./field-registry";

const FieldRendered = ({ config }: { config: FieldConfig }) =>
  fieldRegistry[config.type](config);

export default FieldRendered;
