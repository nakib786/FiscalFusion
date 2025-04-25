// Next.js API route for invoices - connects directly to database
import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    // Connect to MongoDB using the shared client
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('invoices');
    const archiveCollection = db.collection('archived_invoices');
    
    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        // Add an option to fetch archived invoices
        if (req.query.archived === 'true') {
          const archivedData = await archiveCollection.find({}).toArray();
          return res.status(200).json({
            success: true,
            data: archivedData,
            source: 'database'
          });
        }
        // Get all invoices or a specific invoice
        if (req.query.id) {
          // Validate ObjectId before querying
          let objectId;
          try {
            if (!ObjectId.isValid(req.query.id)) {
              return res.status(400).json({
                success: false,
                error: 'Invalid invoice ID format'
              });
            }
            objectId = new ObjectId(req.query.id);
          } catch (err) {
            return res.status(400).json({
              success: false,
              error: 'Invalid invoice ID format'
            });
          }
          
          const invoice = await collection.findOne({ _id: objectId });
          if (!invoice) {
            return res.status(404).json({
              success: false,
              error: 'Invoice not found'
            });
          }
          return res.status(200).json({
            success: true,
            data: invoice
          });
        } else {
          const data = await collection.find({}).toArray();
          return res.status(200).json({
            success: true,
            data: data,
            source: 'database'
          });
        }
      
      case 'POST':
        // Handle different POST operations based on the operation query parameter
        if (req.query.operation === 'restore' && req.query.id) {
          // Restore an archived invoice
          let archivedInvoice = null;
          
          try {
            // Find the archived invoice
            if (ObjectId.isValid(req.query.id)) {
              const objectId = new ObjectId(req.query.id);
              archivedInvoice = await archiveCollection.findOne({ _id: objectId });
            }
            
            if (!archivedInvoice) {
              // Try alternate ways to find the archived invoice
              archivedInvoice = await archiveCollection.findOne({
                $or: [
                  { id: req.query.id },
                  { original_id: req.query.id }
                ]
              });
            }
            
            if (!archivedInvoice) {
              return res.status(404).json({
                success: false,
                error: 'Archived invoice not found'
              });
            }
            
            // Create a copy of the invoice for the active collection
            const restoredInvoice = { ...archivedInvoice };
            
            // Remove archive-specific fields
            delete restoredInvoice._id; // Will get a new _id
            delete restoredInvoice.archive_metadata;
            
            // Add restoration metadata
            restoredInvoice.restored_at = new Date();
            restoredInvoice.restored_by = req.body?.restoredBy || 'Unknown user';
            restoredInvoice.restoration_remark = req.body?.remark || 'No restoration remark provided';
            
            // If there was an original_id, try to use it
            if (archivedInvoice.original_id && ObjectId.isValid(archivedInvoice.original_id)) {
              try {
                restoredInvoice._id = new ObjectId(archivedInvoice.original_id);
              } catch (err) {
                // If we can't use the original ID, MongoDB will generate a new one
                console.log('Could not reuse original ID, will generate a new one');
              }
            }
            
            // Insert back into active collection
            const result = await collection.insertOne(restoredInvoice);
            
            // Remove from archive collection
            await archiveCollection.deleteOne({ _id: archivedInvoice._id });
            
            return res.status(200).json({
              success: true,
              message: 'Invoice restored successfully',
              data: {
                restoredInvoice: { ...restoredInvoice, _id: result.insertedId }
              }
            });
            
          } catch (err) {
            console.error('Error restoring invoice:', err);
            return res.status(500).json({
              success: false,
              error: 'Failed to restore invoice',
              details: err.message
            });
          }
        } else {
          // Create a new invoice (existing functionality)
          const newInvoice = req.body;
          const result = await collection.insertOne(newInvoice);
          return res.status(201).json({
            success: true,
            data: { ...newInvoice, _id: result.insertedId }
          });
        }
      
      case 'PUT':
        // Update an invoice
        if (!req.query.id) {
          return res.status(400).json({
            success: false,
            error: 'Invoice ID is required'
          });
        }
        
        // Validate ObjectId before querying
        let updateObjectId;
        try {
          if (!ObjectId.isValid(req.query.id)) {
            return res.status(400).json({
              success: false,
              error: 'Invalid invoice ID format'
            });
          }
          updateObjectId = new ObjectId(req.query.id);
        } catch (err) {
          return res.status(400).json({
            success: false,
            error: 'Invalid invoice ID format'
          });
        }
        
        const updateData = req.body;
        const updateResult = await collection.updateOne(
          { _id: updateObjectId },
          { $set: updateData }
        );
        
        if (updateResult.matchedCount === 0) {
          return res.status(404).json({
            success: false,
            error: 'Invoice not found'
          });
        }
        
        return res.status(200).json({
          success: true,
          data: { _id: req.query.id, ...updateData }
        });
      
      case 'DELETE':
        // Archive an invoice instead of deleting it
        if (!req.query.id) {
          return res.status(400).json({
            success: false,
            error: 'Invoice ID is required'
          });
        }
        
        // Validate ObjectId before querying
        let deleteObjectId;
        let invoiceToArchive = null;
        
        try {
          // First, check if this is a valid ObjectId
          if (ObjectId.isValid(req.query.id)) {
            deleteObjectId = new ObjectId(req.query.id);
            
            // Try to find by ObjectId
            invoiceToArchive = await collection.findOne({ _id: deleteObjectId });
          }
          
          // If not found by ObjectId, try alternate ways to find it
          if (!invoiceToArchive) {
            // Try string ID matches (id, invoice_id, or string version of _id)
            invoiceToArchive = await collection.findOne({ 
              $or: [
                { id: req.query.id },
                { invoice_id: req.query.id },
                { _id: req.query.id } // In case _id is stored as string in some documents
              ]
            });
          }
        } catch (err) {
          console.error('Error finding invoice to archive:', err);
          return res.status(500).json({
            success: false,
            error: 'Error finding invoice',
            details: err.message
          });
        }
        
        if (!invoiceToArchive) {
          console.log(`Invoice not found: ${req.query.id}`);
          return res.status(404).json({
            success: false,
            error: 'Invoice not found'
          });
        }
        
        // Add archive metadata
        const archiveMetadata = {
          archived_at: new Date(),
          archived_by: req.body?.archivedBy || 'Unknown user',
          archive_remark: req.body?.remark || 'No remark provided',
          original_id: invoiceToArchive._id.toString()
        };
        
        // Create archive record with original invoice data and metadata
        const archiveRecord = {
          ...invoiceToArchive,
          archive_metadata: archiveMetadata
        };
        
        try {
          // Insert into archive collection
          await archiveCollection.insertOne(archiveRecord);
          
          // Remove from active invoices collection
          const deleteResult = await collection.deleteOne({ _id: invoiceToArchive._id });
          
          if (deleteResult.deletedCount === 0) {
            return res.status(500).json({
              success: false,
              error: 'Failed to remove invoice from active collection'
            });
          }
          
          return res.status(200).json({
            success: true,
            message: 'Invoice archived successfully',
            data: {
              archivedInvoice: archiveRecord
            }
          });
        } catch (err) {
          console.error('Error during archiving process:', err);
          return res.status(500).json({
            success: false,
            error: 'Archive operation failed',
            details: err.message
          });
        }
      
      default:
        return res.status(405).json({
          success: false,
          error: 'Method not allowed'
        });
    }
  } catch (error) {
    console.error('MongoDB operation error:', error);
    // Return error without mock data
    return res.status(500).json({
      success: false,
      error: 'Database operation failed',
      message: error.message
    });
  }
} 