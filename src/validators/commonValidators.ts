class CommonValidators {
  // Validator to check undefined
  public isUndefined = (value: string) => value == undefined;

  // Validator to check a value is string or not
  public isString = (value: any) => typeof value === 'string';

  // Validator to check the required params are present in an array or not
  public objectValidator(paramsObj: Object, requiredFields: string[]) {
    try {
      requiredFields.forEach((element) => {
        if (this.isUndefined(paramsObj[element])) {
          // Throw error
          throw {
            name: 'validationError',
            message: `${element} is not present`,
            status: 400,
          };
        }
      });
    } catch (error) {
      throw error;
    }
  }
}

const commonValidators = new CommonValidators();
export default commonValidators;
