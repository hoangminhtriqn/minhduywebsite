import React from 'react';
import { useParams } from 'react-router-dom';

const PriceListDetailPage: React.FC = () => {
  const { id } = useParams(); // Get the ID from the URL

  // Fake data for demonstration
  const fakePriceListData = {
    id: 'fake-price-list-id',
    name: 'Bảng giá xe Sedan Cao cấp',
    description: 'Bảng giá chi tiết các mẫu xe Sedan BMW cao cấp nhất.',
    models: [
      {
        name: 'BMW 7 Series',
        price: '5.369.000.000 VNĐ',
        specs: ['Động cơ: 3.0L', 'Công suất: 333 HP', 'Hộp số: Tự động 8 cấp'],
        image: '/images/7-series.webp',
      },
      {
        name: 'BMW 5 Series',
        price: '2.969.000.000 VNĐ',
        specs: ['Động cơ: 2.0L', 'Công suất: 184 HP', 'Hộp số: Tự động 8 cấp'],
        image: '/images/5-series.webp',
      },
      // Add more fake models as needed
    ],
    notes: [
      'Giá trên đã bao gồm VAT.',
      'Giá chưa bao gồm chi phí đăng ký, đăng kiểm, bảo hiểm.',
      'Chương trình khuyến mãi có thể thay đổi tùy thời điểm.',
    ],
  };

  // In a real application, you would fetch data based on the 'id' from useParams
  const priceList = id === fakePriceListData.id ? fakePriceListData : null;

  return (
    <div className="price-list-detail-page">
      {/* Page Banner - Similar to other public pages */}
      <section className="page-banner">
         <div className="page-banner__container">
            <h1 className="page-banner__title">CHI TIẾT BẢNG GIÁ</h1>
            <p className="page-banner__subtitle">{priceList ? `Thông tin chi tiết về ${priceList.name}` : 'Không tìm thấy bảng giá'}</p>
         </div>
      </section>

      {/* Main Content Section */}
      <section className="price-list-detail-section">
         <div className="price-list-detail-section__container">
            {!priceList ? (
               <h2>Không tìm thấy bảng giá với ID: {id}</h2>
            ) : (
               <>
                  <h2>{priceList.name}</h2>
                  <p>{priceList.description}</p>

                  {/* Display models in a table or list */}
                   <div className="price-list-detail-section__models">
                      {priceList.models.map((model, index) => (
                         <div key={index} className="price-list-detail-section__model-item">
                            <img src={model.image} alt={model.name} className="price-list-detail-section__model-image"/>
                            <div className="price-list-detail-section__model-info">
                               <h3>{model.name}</h3>
                               <p>Giá: {model.price}</p>
                               <ul>
                                  {model.specs.map((spec, specIndex) => (
                                     <li key={specIndex}>{spec}</li>
                                  ))}
                               </ul>
                            </div>
                         </div>
                      ))}
                   </div>

                   {/* Display notes */}
                   <div className="price-list-detail-section__notes">
                      <h4>Ghi chú:</h4>
                      <ul>
                         {priceList.notes.map((note, index) => (
                            <li key={index}>{note}</li>
                         ))}
                      </ul>
                   </div>
               </>
            )}
         </div>
      </section>

      {/* You might add other sections like related products or contact form */}

    </div>
  );
};

export default PriceListDetailPage; 