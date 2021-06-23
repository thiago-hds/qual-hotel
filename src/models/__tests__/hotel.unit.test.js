const Hotel = require('../hotel');
const factory = require('../../libs/factories');

const assertValidationReturn = function (validationReturn, propertyName) {
  expect(validationReturn).toBeDefined();
  expect(validationReturn).toHaveProperty('errors');
  expect(validationReturn.errors).toHaveProperty(propertyName);
};

describe('User model test', () => {
  describe('validation', () => {
    it('should be invalid if name is empty', async () => {
      // Act
      const data = await factory.attrs('Hotel', { name: undefined });
      const hotel = new Hotel(data);
      const err = hotel.validateSync();

      // Assert
      assertValidationReturn(err, 'name');
    });

    it('should be invalid if price is empty', async () => {
      // Act
      const data = await factory.attrs('Hotel', { price: undefined });
      const hotel = new Hotel(data);
      const err = hotel.validateSync();

      // Assert
      assertValidationReturn(err, 'price');
    });

    it('should be invalid if price is lower than zero', async () => {
      // Act
      const data = await factory.attrs('Hotel', { price: -300 });
      const hotel = new Hotel(data);
      const err = hotel.validateSync();

      // Assert
      assertValidationReturn(err, 'price');
    });

    it('should be invalid if description is empty', async () => {
      // Act
      const data = await factory.attrs('Hotel', { description: undefined });
      const hotel = new Hotel(data);
      const err = hotel.validateSync();

      // Assert
      assertValidationReturn(err, 'description');
    });

    it('should be invalid if address is empty', async () => {
      // Act
      const data = await factory.attrs('Hotel', { address: undefined });
      const hotel = new Hotel(data);
      const err = hotel.validateSync();

      // Assert
      assertValidationReturn(err, 'address');
    });
  });
});
