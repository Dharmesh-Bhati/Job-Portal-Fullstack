using System.Linq.Expressions;
using System.Threading.Tasks;
 
namespace JobPortalWebApi.Data
{
    // IGenericRepository.cs
    public interface IGenericRepository<T> where T : class
    {
        Task<T> GetById(int id);
        Task<IEnumerable<T>> GetAll();
        Task Add(T entity);
        void Update(T entity);
        void Delete(T entity);
        Task<T> FindSingleAsync(Expression<Func<T, bool>> predicate);
    }
}