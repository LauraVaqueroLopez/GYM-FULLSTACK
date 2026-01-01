DELIMITER $$

CREATE TRIGGER before_insert_clientes_codigo
BEFORE INSERT ON clientes
FOR EACH ROW
BEGIN
  DECLARE v_codigo INT;

  IF NEW.codigo_personal IS NULL THEN
    REPEAT
      SET v_codigo = FLOOR(100000 + RAND() * 900000);
    UNTIL NOT EXISTS (
      SELECT 1 FROM clientes WHERE codigo_personal = LPAD(v_codigo,6,'0')
    )
    END REPEAT;

    SET NEW.codigo_personal = LPAD(v_codigo,6,'0');
  END IF;
END$$

DELIMITER ;
