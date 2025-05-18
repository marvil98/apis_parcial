import { AeropuertoEntity } from "src/aeropuerto/aeropuerto.entity/aeropuerto.entity";
import { Column, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

export class AerolineaEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    nombre: string;
  
    @Column()
    descripcion: string;
  
    @Column()
    fechaFundacion: Date;
  
    @Column()
    paginaWeb: string;

    @ManyToMany(() => AeropuertoEntity, aeropuerto => aeropuerto.aerolineas)
    aeropuertos: AeropuertoEntity[];
}
