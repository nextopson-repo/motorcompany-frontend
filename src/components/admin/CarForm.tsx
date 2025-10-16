import  { useState } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { addVehicle } from '../../store/slices/appSlice';

export default function CarForm() {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number | ''>('');
  const [price, setPrice] = useState<number | ''>('');
  const [kmDriven, setKmDriven] = useState<number | ''>('');
  const [fuelType, setFuelType] = useState('Petrol');
  const [transmission, setTransmission] = useState('Manual');
  const [location, setLocation] = useState('');
  const [owner, setOwner] = useState('');
  const [condition, setCondition] = useState<'New' | 'Used'>('Used');
  const [image, setImage] = useState('');

  const handleSubmit = () => {
    if (!title || !brand || !model || !year || !price || !kmDriven) return alert('Fill all fields');
    const newVehicle = {
      id: Date.now().toString(),
      title: title,
      carName: title,
      brand,
      model,
      variant: '',
      bodyType: '',
      fuelType: fuelType as 'Petrol' | 'Diesel' | 'CNG' | 'Electric',
      transmission: transmission as 'Manual' | 'Automatic',
      ownership: '1st' as '1st' | '2nd' | '3rd' | '3+',
      manufacturingYear: Number(year),
      registrationYear: Number(year),
      kmDriven: kmDriven.toString(),
      seats: '5' as '2' | '4' | '5' | '6' | '7' | '8',
      isSale: 'Sell' as 'Sell' | 'Rent',
      carPrice: price.toString(),
      image: image || 'https://via.placeholder.com/400',
      address: {
        state: '',
        city: location,
        locality: ''
      },
      owner: owner,
      isActive: true
    };
    dispatch(addVehicle(newVehicle));
    alert('Vehicle added successfully!');
    // Clear form
    setTitle(''); setBrand(''); setModel(''); setYear(''); setPrice(''); setKmDriven(''); setLocation(''); setOwner(''); setImage('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h3 className="text-xl font-bold mb-2">Add New Vehicle</h3>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="input"/>
      <input type="text" placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} className="input"/>
      <input type="text" placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} className="input"/>
      <input type="number" placeholder="Year" value={year} onChange={(e) => setYear(Number(e.target.value))} className="input"/>
      <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="input"/>
      <input type="number" placeholder="Km Driven" value={kmDriven} onChange={(e) => setKmDriven(Number(e.target.value))} className="input"/>
      <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="input"/>
      <input type="text" placeholder="Owner" value={owner} onChange={(e) => setOwner(e.target.value)} className="input"/>
      <input type="text" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} className="input"/>
      
      <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} className="input">
        <option value="Petrol">Petrol</option>
        <option value="Diesel">Diesel</option>
        <option value="CNG">CNG</option>
        <option value="Electric">Electric</option>
      </select>

      <select value={transmission} onChange={(e) => setTransmission(e.target.value)} className="input">
        <option value="Manual">Manual</option>
        <option value="Automatic">Automatic</option>
      </select>

      <select value={condition} onChange={(e) => setCondition(e.target.value as any)} className="input">
        <option value="New">New</option>
        <option value="Used">Used</option>
      </select>

      <button onClick={handleSubmit} className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">Add Vehicle</button>
    </div>
  );
}
