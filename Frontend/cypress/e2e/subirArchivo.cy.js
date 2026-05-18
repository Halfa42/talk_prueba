describe('SubirArchivo', () => {
    const baseUrl = 'http://localhost:5173';
    it('Archivo subido correctamente', () => {
        cy.visit(baseUrl + '/tutor/TutorMaterials');
        cy.get('[data-cy= "title"]').type('Archivo de prueba');
        cy.get('[data-cy= "topic"]').type('Prueba');
        cy.get('select').select('A1')
        cy.get('[data-cy= "description"]').type('Archivo de prueba para subir');
        cy.get('[data-cy= "SubirArchivoButton"]').click();
        cy.get('input[type="file"]').selectFile('cypress/fixtures/archivo.pdf', { force: true });
        cy.get('[data-cy= "GuardarMaterialButton"]').click();
        cy.get('[data-cy="autorizado"]').should('contain', 'Archivo subido correctamente');
    })

    it('Archivo no subido', () => {
        cy.visit(baseUrl + '/tutor/TutorMaterials');
        cy.get('[data-cy= "title"]').type('Archivo de prueba 2');
        cy.get('[data-cy= "topic"]').type('Prueba 2');
        cy.get('select').select('A2')
        cy.get('[data-cy= "description"]').type('Archivo de prueba para subir 2');
        cy.get('[data-cy= "SubirArchivoButton"]').click();
        cy.get('input[type="file"]').selectFile('cypress/fixtures/archivo.html', { force: true });
        cy.get('[data-cy= "GuardarMaterialButton"]').click();
        cy.get('[data-cy="autorizado"]').should('contain', 'Archivo no subido, formato no permitido');
    })

    it('Campos vacíos', () => {
        cy.visit(baseUrl + '/tutor/TutorMaterials');
        cy.get('[data-cy= "title"]').type('Archivo de prueba 3');
        cy.get('[data-cy= "topic"]').type('Prueba 3');
        cy.get('select').select('A3')
        cy.get('[data-cy= "description"]').type('Archivo de prueba para subir 3');
        cy.get('[data-cy= "GuardarMaterialButton"]').click();
        cy.get('[data-cy="autorizado"]').should('contain', 'Archivo no subido, por favor complete todos los campos');
    })
});