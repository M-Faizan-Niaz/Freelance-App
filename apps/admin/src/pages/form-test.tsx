import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormBuilder from "@/components/form-builder";
import { formTestSchema, FormTestValues } from "./form-test.schema";
import { registrationFields } from "./form-test.config";

const RegistrationForm = ({
  onSubmit,
}: {
  onSubmit: (data: FormTestValues) => void;
}) => {
  const { handleSubmit, formState: { isSubmitting } } = useFormContext<FormTestValues>();

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-5">
        <h1 className="text-3xl font-bold text-gray-800">Registration Form</h1>
        <p className="text-sm text-gray-500 mt-2">Fill in your details below</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormBuilder
          fields={registrationFields}
          submitText="Submit Form"
          isSubmitting={isSubmitting}
        />
      </form>
    </div>
  );
};

function FormTest() {
  const methods = useForm<FormTestValues>({
    resolver: zodResolver(formTestSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
    },
  });

  function onSubmit(data: FormTestValues) {
    console.log("Form submitted with data:", data);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-55">
      <FormProvider {...methods}>
        <RegistrationForm onSubmit={onSubmit} />
      </FormProvider>
    </div>
  );
}

export default FormTest;
