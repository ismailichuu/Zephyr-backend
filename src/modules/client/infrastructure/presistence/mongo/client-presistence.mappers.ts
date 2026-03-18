import { ClientProfile } from 'src/modules/client/domain/entities/client-profile.entity';
import { ClientProfileDocument } from './client-profile.schema';

export class ClientPresistenceMappers {
  static toDomain(clientProfileDoc: ClientProfileDocument) {
    return ClientProfile.create({
      id: clientProfileDoc._id.toString() ?? null,
      userId: clientProfileDoc.userId,
      imageUrl: clientProfileDoc.imageUrl,
      bio: clientProfileDoc.bio,
      companyName: clientProfileDoc.companyName,
      location: clientProfileDoc.location,
      updatedAt: clientProfileDoc.updatedAt ?? null,
    });
  }

  static toPersistence(
    clientProfile: ClientProfile,
  ): Partial<ClientProfileDocument> {
    return {
      userId: clientProfile.userId,
      imageUrl: clientProfile.imageUrl,
      bio: clientProfile.bio,
      location: clientProfile.location,
      companyName: clientProfile.companyName,
    };
  }
}
