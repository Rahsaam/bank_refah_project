import { useQuery } from '@tanstack/react-query';
import { fetchAlbums, deleteAlbum } from '../../api/albums';
import { fetchPhotos, deletePhoto } from '../../api/photos';
import GenericCRUDTable from '../common/GenericCRUDTable';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

type SubtabType = 'albums' | 'photos';

interface MediaTabProps {
  initialSubtab?: string;
}

const MediaTab = ({ initialSubtab }: MediaTabProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  console.log(searchParams);
  
  const activeSubtab: SubtabType = initialSubtab === 'photos' ? 'photos' : 'albums';

  useEffect(() => {
    if (!searchParams.get('subtab')) {
      setSearchParams({
        tab: 'media',
        subtab: 'albums',
      });
    }
  }, [searchParams, setSearchParams]);

  const { data: albums = [], isLoading: albumsLoading } = useQuery({
    queryKey: ['albums'],
    queryFn: fetchAlbums,
  });

  const { data: photos = [], isLoading: photosLoading } = useQuery({
    queryKey: ['photos'],
    queryFn: fetchPhotos,
  });

  const handleSubtabChange = (subtabId: SubtabType) => {
    setSearchParams({
      tab: 'media',
      subtab: subtabId, 
    });
  };

  const columns = {
    albums: [
      { key: 'id', label: 'ID' },
      { key: 'title', label: 'عنوان آلبوم' },
      { key: 'userId', label: 'شناسه کاربر' },
    ],
    photos: [
      { key: 'id', label: 'ID' },
      { key: 'title', label: 'عنوان عکس' },
      { 
        key: 'thumbnailUrl', 
        label: 'تصویر',
        render: (value: string) => (
          <img src={value} alt="thumbnail" className="w-8 h-8 rounded object-cover" />
        )
      },
    ],
  };

  const subtabs = [
    { id: 'albums', label: 'آلبوم‌ها' },
    { id: 'photos', label: 'عکس‌ها' },
  ];

  return (
    <div>
      <div className="flex gap-2 border-b mb-4">
        {subtabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleSubtabChange(tab.id as SubtabType)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeSubtab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeSubtab === 'albums' && (
        <GenericCRUDTable
          title="مدیریت آلبوم‌ها"
          data={albums}
          columns={columns.albums}
          deleteFn={deleteAlbum}
          queryKey="albums"
          isLoading={albumsLoading}
        />
      )}

      {activeSubtab === 'photos' && (
        <GenericCRUDTable
          title="مدیریت عکس‌ها"
          data={photos.slice(0, 20)}
          columns={columns.photos}
          deleteFn={deletePhoto}
          queryKey="photos"
          isLoading={photosLoading}
        />
      )}
    </div>
  );
};

export default MediaTab;