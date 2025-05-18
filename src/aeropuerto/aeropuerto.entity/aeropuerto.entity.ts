import { AerolineaEntity } from "src/aerolinea/aerolinea.entity/aerolinea.entity";
import { Column, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

export class AeropuertoEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    nombre: string;
  
    @Column({ length: 3 })
    codigo: string;
  
    @Column()
    pais: string;
  
    @Column()
    ciudad: string;

    @ManyToMany(() => AerolineaEntity, aerolinea => aerolinea.aeropuertos)
    @JoinTable()
    aerolineas: AerolineaEntity[];
}
