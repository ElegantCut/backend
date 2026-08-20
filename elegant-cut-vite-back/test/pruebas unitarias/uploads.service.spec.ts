import { Test, TestingModule } from '@nestjs/testing';
import { UploadsService } from '../../src/modules/uploads/uploads.service';
import { v2 as cloudinary } from 'cloudinary';

jest.mock('cloudinary');

describe('UploadsService', () => {
    let service: UploadsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UploadsService],
        }).compile();

        service = module.get<UploadsService>(UploadsService);
    });

    it('should reject with Error when cloudinary upload fails', async () => {
        const file = { buffer: Buffer.from('test') } as any;

        (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation((opts, callback) => {
            callback({ message: 'Error simulado' }, null);
            return { end: jest.fn() };
        });

        await expect(service.uploadFile(file)).rejects.toThrow('Error simulado');
    });

    it('should reject with fallback Error message when cloudinary upload fails without message', async () => {
        const file = { buffer: Buffer.from('test') } as any;

        (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation((opts, callback) => {
            callback({}, null); // sin message
            return { end: jest.fn() };
        });

        await expect(service.uploadFile(file)).rejects.toThrow('Error al subir a Cloudinary');
    });

    it('should resolve result when upload succeeds', async () => {
        const file = { buffer: Buffer.from('test') } as any;

        (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation((opts, callback) => {
            callback(null, { secure_url: 'http://test.com/img.png' });
            return { end: jest.fn() };
        });

        const result = await service.uploadFile(file);
        expect((result as any).secure_url).toBe('http://test.com/img.png');
    });
});
