export interface Order {
  RequiredDate: string;
  CustomerID: string;
  EmployeeID: number;
  ShipVia: number;
  ShipName: string;
  ShipCity: string;
  ShipPostalCode: string;
  ShipCountry: string;
  UnitPrice: number;
  Discount: number;
  OrderDate: string;
  OrderID: number;
  ShippedDate: string;
  Freight: number;
  ShipAddress: string;
  ShipRegion: string;
  ProductID: number;
  Quantity: number;
}
